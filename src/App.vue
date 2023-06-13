<script lang="ts" setup>
import {
  changeInputState,
  Command,
  getConfig,
  onUserInput,
  openUrl,
  useCommandEvent,
  useDebouncedRef
} from "@fzdwx/launcher-api";
import {onMounted, ref, watch} from "vue";
import {useRepositories} from "@/use/useRepositories";
import {formatDate} from "./util";

let commandEvent = useCommandEvent();

const debouncedUserInput = useDebouncedRef('', 500);
onUserInput('github-repository-search', (s) => {
  commandEvent.emitter.emit('setInputValue', s)
  debouncedUserInput.value = s;
})

watch(debouncedUserInput, (value) => {
  console.log(value)
})

const config = getConfig();
const {response, loading} = useRepositories(debouncedUserInput, config.value['gh-token']);

watch(config, async () => {
})
onMounted(() => {
  changeInputState({
    disableFilter: true
  })
})

watch(loading, () => {
  changeInputState({
    loading: loading.value
  })
})

//@ts-ignore
const numberFormatter = new Intl.NumberFormat("en-US", {notation: "compact", compactDisplay: "short"});

</script>

<template>
  <div class="body dark">
    <Command.Dialog :visible="true" theme="raycast">
      <template #header>
        <div class="hidden">
          <Command.Input disable-filter/>
        </div>
      </template>
      <template #body>
        <Command.List class="mt-[-15px]">
          <Command.Empty>Type to search repo.</Command.Empty>
          <Command.Group v-if="response"
                         :heading="'Found Repositories '+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + response.total_count">
            <Command.Item v-for="item in response.items"
                          @select="()=>{
                            openUrl(item.html_url)
                          }"
                          :data-value="item.name">
              <img :src="item.owner.avatar_url" alt="owner avater" class="w-6 h-6 mr-2"/>
              <span>
                {{ item.full_name }}
              </span>
              <span class="text-bgray10">
                ✩ {{ numberFormatter.format(item.stargazers_count) }}
              </span>

              <span class="absolute right-5 text-bgray10">
                {{ item.language}}
                •
                {{ formatDate(item.updated_at) }}
              </span>
            </Command.Item>
          </Command.Group>

        </Command.List>
      </template>
    </Command.Dialog>
  </div>
</template>

<style>
</style>
