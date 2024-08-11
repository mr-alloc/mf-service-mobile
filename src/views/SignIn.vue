<template>
    <div class="sign-in-container">
      <h1 class="sign-in-page-title">로그인</h1>
      <div class="form-wrapper">
        <BlinkInput name="userName" type="email" placeHolder="E-mail" ref="emailInput"
                    :on-input="(event: InputEvent) => methods.validateEmailAndPassword(event)"
                    :is-hold="state.inputHold" class="narrow" :no-mark="true" :if-enter="methods.ifEnterKeyOnPassword"
        />
        <BlinkInput name="userPassword" type="password" placeHolder="Password" ref="passwordInput"
                    :on-input="(event: InputEvent) => methods.validateEmailAndPassword(event)"
                    :is-hold="state.inputHold" class="narrow" :no-mark="true" :if-enter="methods.ifEnterKeyOnPassword"
                    :if-visible-need="(isVisible: boolean) => methods.visiblePassword(isVisible, 'userPassword')"

        />
        <SimpleButton buttonName="로그인" :clickBehavior="methods.signIn" :submittable="state.isSubmittable"/>
      </div>
      <div class="sing-up-notice">
        <span>아직 회원이 아닌가요? <RouterLink to="/sign-up" class="word">회원 가입</RouterLink>으로 미션 패밀리에 합류하세요!</span>
      </div>
    </div>
</template>

<script setup lang="ts">
import { inject, reactive, ref } from 'vue'
import BlinkInput from "@/components/global/BlinkInput.vue";
import {Patterns, validate} from "@/utils/Util";
import SimpleButton from "@/components/global/SimpleButton.vue";
import {call} from "@/utils/NetworkUtil";
import {useRouter} from "vue-router";
import AccountAPI from "@/constant/api-meta/Account";
import {useMemberInfoStore} from "@/stores/MemberInfoStore";
import {
  removeAccessToken,
  removeRefreshToken,
  setAccessToken,
  setRefreshToken,
  setSelectedFamilyId
} from "@/utils/LocalCache";
import {AlertType, useAlertStore} from "@/stores/AlertStore";
import type InputComponent from '@/classes/InputComponent'
import { ex } from '@/utils/Undefinable'
import PopupUtil from '@/utils/PopupUtil'
import * as GetUserSetting from '@/classes/api-spec/member/GetUserSetting'
import Member from '@/constant/api-meta/Member'
import { ResponseBody } from '@/classes/api-spec/member/GetUserSetting'
import { useOwnFamiliesStore } from '@/stores/OwnFamiliesStore'
import type SelectFamilyOption from '@/classes/SelectFamilyOption'

const emitter: any = inject('emitter')
const router = useRouter();
const ownFamiliesStore = useOwnFamiliesStore()
const memberInfoStore = useMemberInfoStore();
const notificationStore = useAlertStore();

const emailInput = ref<InputComponent|null>(null);
const passwordInput = ref<InputComponent|null>(null);

const state = reactive({
  //입력값 유효성 검증
  emailInputValidate: false,
  passwordInputValidate: false,

  inputHold: false,
  isSubmittable: false,
});

const methods = {
  ifEnterKeyOnPassword(event: KeyboardEvent) {
    methods.signIn();
  },
  validateEmailAndPassword(event: InputEvent) {
    const email = ex(emailInput.value?.input?.value).str();
    const password = ex(passwordInput.value?.input?.value).str();

    state.isSubmittable = email.length > 0 && password.length > 0;
  },
  visiblePassword(isVisible:boolean, elementName: string) {
    const element: HTMLInputElement = document.getElementsByName(elementName)[0] as HTMLInputElement;
    element.type = isVisible ? 'text' : 'password';
  },

  checkAllInput() {
    state.isSubmittable = state.emailInputValidate && state.passwordInputValidate;
  },
  async signIn() {
    if (!state.isSubmittable) return;

    const email = ex(emailInput.value?.input?.value).str();
    const password = ex(passwordInput.value?.input?.value).str();

    if (!validate(email, Patterns.Email) || !validate(password, Patterns.Password)) {
      notificationStore.alert(AlertType.INFO, "로그인 오류", "이메일과 비밀번호를 확인해주세요.")
      return
    }

    //최초 로그인 전 패밀리 선택 초기화
    setSelectedFamilyId(0)
    const requestBody = {
      deviceCode: 1,
      email: email,
      password: password
    };
    const signInResult = await call<any, any>(AccountAPI.VerifyAccount, requestBody,
        async (response) => {
          if (response.status === 200) {
            const {accessToken, refreshToken} = response.data
            setAccessToken(accessToken)
            setRefreshToken(refreshToken)

            await call<any, ResponseBody>(Member.GetUserSetting, null, (response) => {
              const setting = ResponseBody.fromJson(response.data)
              const selected = ownFamiliesStore.families.find(family => family.id === setting.mainFamily)?.toSelectFamilyOption()
                ?? ownFamiliesStore.selectorState.defaultOption as SelectFamilyOption
              ownFamiliesStore.changeFamily(emitter, selected)
              router.push('/calendar')
            })
          }

          return true
        },
        (spec, error) => {
          memberInfoStore.removeMemberInfo()
          removeAccessToken()
          removeRefreshToken()
          const userStatus = error.response.headers["user-status"];
          if (userStatus === "BLOCKED") {
            return false;
          }
          const body = error.response.data
          const message = spec.getMessage(body.code) ?? spec.defaultMessage;

          PopupUtil.alert('로그인 오류', message)
          notificationStore.alert(AlertType.INFO, "로그인 오류", message)
          return false
        }
    );

    return signInResult
  }
}

</script>

<style scoped lang="scss">
@import '@assets/main';

.sign-in-container {
  display: flex;
  flex-direction: column;
  width: 340px;
  margin: 10px auto;
  justify-content: center;

  .sign-in-page-title {
    font-weight: bold;
    text-align: center;
    margin: 10px 0;
  }

  .form-wrapper {
    padding: 15px 20px;
    display: flex;
    width: 100%;
    justify-content: space-evenly;
    flex-direction: column;
    align-items: center;
    border-radius: 15px;
    border: lightgray 1px solid;

  }

  .sing-up-notice {
    padding: 5px 8px;
  }
}
</style>
