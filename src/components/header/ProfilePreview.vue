<template>
  <div class="user-session-info" v-on:click="methods.moveToUserInfo()">
    <span class="user-img-area">
      <img :src="profileMemberStore.profileMember.profile" alt="유저 프로필 이미지"/>
    </span>
    <div class="current-user">
      <span class="user-name">{{ methods.getNickname() }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import {useMemberInfoStore} from "@/stores/MemberInfoStore";
import {useRouter} from "vue-router";
import {useNavigateMenuStore} from "@/stores/NavigateMenuStore";
import {AccountRole} from "@/constant/AccountRole";
import {useProfileMemberStore} from "@/stores/ProfileMemberStore";

let router = useRouter();
const memberInfoStore = useMemberInfoStore();
const leftMenuStore = useNavigateMenuStore();
const profileMemberStore = useProfileMemberStore();
const methods = {
  moveToUserInfo() {
    //GUEST
    // if (memberInfoStore.needMemberInfo()) {
    //   router.push("/sign-in")
    //   return;
    // }
    // switch (memberInfoStore.getCurrentAccountRole()) {
    //   case AccountRole.MEMBER:
    //     router.push("/profile");
    //     break;
    //   default:
    //     router.push("/sign-in");
    //     break;
    // }
  },
  getNickname() {
    return memberInfoStore.needMemberInfo()
        ? "Guest"
        : profileMemberStore.profileMember.nickname ?? "No Name";
  },
}
</script>

<style scoped lang="scss">
@import "@assets/main";

.user-session-info {
  padding: 3px 5px;
  display: flex;
  flex-direction: row;
  border-radius: 5px;
  max-width: 200px;
  margin: 5px 2px;
  user-select: none;
  border: 1px solid $standard-light-gray-in-white;

  .user-img-area {
    display: flex;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 30px;
    background-color: lightgray;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    overflow: hidden;

    .guest-icon {
      color: white;
    }

    img {
      width: 100%;
      height: 100%;
    }
  }

  .current-user {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    height: 1.5rem;
    width: 110px;

    .user-name {
      display: inline-block;
      font-weight: bold;
      text-overflow: ellipsis;
      text-decoration: none;
      white-space: nowrap;
      padding: 3px 5px;
      overflow: hidden;
    }
  }

  &:hover {
    cursor: pointer;
  }
}
</style>
