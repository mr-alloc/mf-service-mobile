<template>
  <div class="schedule-mode-indicator-container" :class="[`${props.mode.name}`]">
    <div class="mode-frame">
      <span class="mode-alias">{{ props.mode.alias }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import type ScheduleMode from '@/constant/ScheduleMode'

const props = defineProps<{
  mode: ScheduleMode,
}>()
</script>
<style scoped lang="scss">
@import "@assets/main";

.schedule-mode-indicator-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 3px;

  .mode-frame {
    line-height: 1;
    width: max-content;
    padding: 2px 5px;
    border-radius: 5px;
  }


  &.single {

    .mode-frame {
      background-color: #ffdada;
      border: 1px solid #ffa7a7;

      .mode-alias {
        color: #d13030;
      }
    }

  }

  &.multiple {

    .mode-frame {
      background-color: #edddfa;
      border: 1px solid $signature-purple;

      .mode-alias {
        color: $signature-purple;
      }

    }
  }

  &.always {

    .mode-frame {
      background-color: #d1f7d1;
      border: 1px solid $soft-green;

      .mode-alias {
        color: $soft-green;
      }
    }

  }

  &.period {
    .mode-frame {
      background-color: #d5e2f4;
      border: 1px solid $soft-navy;

      .mode-alias {
        color: $soft-navy;
      }
    }
  }

  &.repeat {
    .mode-frame {
      background-color: $standard-light-gray-in-white;
      border: 1px solid $warm-black;

      .mode-alias {
        color: $warm-black;
      }
    }
  }
}
</style>
