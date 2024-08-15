import {defineStore} from "pinia";
import {ref} from "vue";
import type {Moment} from "moment-timezone";
import DateUtil from "@/utils/DateUtil";
import {CalendarHoliday, type IMission, RequestBody, ResponseBody} from "@/classes/api-spec/mission/GetMemberCalendar";
import AnniversaryValue from "@/classes/api-spec/AnniversaryValue";
import CalendarAnniversary from "@/classes/CalendarAnniversary";
import {call} from "@/utils/NetworkUtil";
import Mission from "@/constant/api-meta/Mission";
import CollectionUtil from "@/utils/CollectionUtil";
import * as GetAnniversaries from "@/classes/api-spec/GetAnniversaries";
import Anniversary from "@/constant/api-meta/Anniversary";
import CalendarDate from "@/classes/CalendarDate";
import TemporalUtil from "@/utils/TemporalUtil";
import type MissionDetail from "@/classes/MissionDetail";
import CalendarMission from "@/classes/CalendarMission";
import {WeekScheduleGeometry} from "@/classes/WeekScheduleGeometry";
import CalendarWeekMission from "@/classes/CalendarWeekMission";
import Color from "@/constant/Color";
import moment from 'moment-timezone'

export const useCalendarStore = defineStore('calendar', () => {

    const timestamp = ref(0);

    function resetSelected() {
        timestamp.value = 0;
    }

    function selectDate(selectedDay: CalendarDate) {
        //재클릭시 초기화
        if (selectedDay.timestamp === timestamp.value) {
            resetSelected();
            return;
        }
        timestamp.value = selectedDay.timestamp;
    }

    function calcAnniversaries(values: Array<AnniversaryValue>, startOfCalendar: number, endOfCalendar: number) {
        const anniversaries = values.flatMap(value => CalendarAnniversary.of(
          value,
          startOfCalendar,
          endOfCalendar
        ));
        return anniversaries.reduce((anniversaryMap, anniversary) => {
            const period = anniversary.period;
            const days = TemporalUtil.getDiffDays(period.startAt, period.endAt);
            const localDaysArray = TemporalUtil.getLocalDaysArray(period.startAt, days);
            const originName = anniversary.name;
            localDaysArray.map((date, index) => {
                if (localDaysArray.length > 1) {
                    anniversary.applyName(`${originName} ${index + 1}/${localDaysArray.length}`);
                }
                if (anniversaryMap.has(date.timestamp)) {
                    const anniversaries = anniversaryMap.get(date.timestamp);
                    if (anniversaries) {
                        anniversaries.push(anniversary);
                    }
                } else {
                    anniversaryMap.set(date.timestamp, [anniversary]);
                }
            });
            return anniversaryMap;
        }, new Map<number, Array<CalendarAnniversary>>());
    }

    function calcMissionCoordinates(details: Array<MissionDetail>, startOfCalendar: number, endOfCalendar: number) {
        const missions = details.flatMap((detail) => CalendarMission.of(
            detail,
            startOfCalendar,
            endOfCalendar
        ));

        const weeksMap = new Map<number, Array<CalendarWeekMission>>();
        const daysPerWeekMap = DateUtil.forEachWeek(startOfCalendar, endOfCalendar, (week, start, end) => {
            missions.forEach((mission) => {
                const weekMission = CalendarWeekMission.of(start, end, mission);
                if (mission.startAt <= end && mission.endAt >= start) {
                    if (weeksMap.has(week)) {
                        const missions = weeksMap.get(week);
                        if (missions) {
                            missions.push(weekMission);
                        }
                    } else {
                        weeksMap.set(week, [weekMission]);
                    }
                }
            })
        });

        const scheduleMap = new Map<number, Array<WeekScheduleGeometry>>();
        daysPerWeekMap.forEach((days, week) => {
            const thisWeekSchedules = new Array<WeekScheduleGeometry>();
            const thisWeekMissions = CollectionUtil.toMap(
                weeksMap.get(week) ?? [],
                (mission) => `${mission.mission.id}_${mission.startAt}`
            );

            //여기서 사용할 미션은 실제로 한개의 스케쥴이더라도 2주에 걸쳐있다면 2개의 미션으로 나누어지며, 요일의 시작일을 기준으로 미션의 시작시간이 다시 설정된다.
            // console.debug(`%c[%c${week}번째 주%c]`, Color.RED, Color.BLACK, Color.RED);
            days.sort(CalendarDate.TIMESTAMP_ASCENDING_CONDITION).forEach((day) => {
                //레이어를 할당하기위해 필요한 레이어를 구하는 조건은 다음과같다.

                //1. 일정 종료시간이 오늘이후인 스케쥴들의 y좌표 구한다.
                const verticalCoordinates = thisWeekSchedules
                    .filter(schedule => schedule.mission.endAt >= day.timestamp)
                    .map(schedule => schedule.y);

                //2. 사용중이지않은 y좌표를 재사용하기위해 기준점을 잡을 최대 y좌표를 구한다.
                const maxCoordinate = verticalCoordinates.length === 0 ? 1 : Math.max(...verticalCoordinates);

                //3. 최대 y좌표까지 재사용할 수 있는 y좌표 (notUsedLayers)를 구한다.
                const notUsedLayers = new Array(maxCoordinate).fill(0).map((_, idx) => idx + 1)
                    .filter(layer => !verticalCoordinates.includes(layer));

                //4. 일정이 오늘 시작되는 미션들은 모두 레이어에 할당해야 한다.
                const todayStartMissions = [...thisWeekMissions.values()]
                    .filter(mission => day.timestamp <= mission.startAt && mission.startAt < (day.timestamp + TemporalUtil.SECONDS_IN_DAY));

                //5. 따라서 needNewLayerCount 만큼의 레이어를 새로 할당한다.
                const needNewLayerCount = todayStartMissions.length > notUsedLayers.length ? todayStartMissions.length - notUsedLayers.length : 0;
                const newLayers = new Array(needNewLayerCount).fill(0)
                    .map((_, idx) => maxCoordinate + (idx + 1));

                notUsedLayers.concat(newLayers)
                    .sort((pre, cur) => pre - cur)
                    .forEach((layer) => {
                        //레이어별로 그려줘야 하기때문에, 이미 레이어에 미션이 정해지면, 다음 레이어로 넘어간다.
                        const entry = [...thisWeekMissions.entries()]
                            .sort((pre, cur) => {
                                const modularOfA = pre[1].mission.endAt - pre[1].mission.startAt
                                const modularOfB = cur[1].mission.endAt - cur[1].mission.startAt
                                //장기 일정 우선정렬 및 시작시간 정렬
                                return modularOfB - modularOfA || pre[1].startAt - cur[1].startAt
                            })
                            //오늘 시작하는 미션
                            .find((mission) => day.timestamp <= mission[1].startAt && mission[1].startAt < (day.timestamp + TemporalUtil.SECONDS_IN_DAY));
                        if (!entry) return;

                        // console.debug(`${day.dayOfWeek.name} ${layer}줄: ${entry[1].toString()}`);
                        thisWeekSchedules.push(new WeekScheduleGeometry(day.dayOfWeek.sundayStartValue, layer, entry[1]));
                        thisWeekMissions.delete(entry[0]);
                    });
            });
            scheduleMap.set(week, thisWeekSchedules);
        });

        return scheduleMap;
    }

    return {
        timestamp,
        selectDate,
        resetSelected,
        calcAnniversaries,
        calcMissionCoordinates
    }
})
