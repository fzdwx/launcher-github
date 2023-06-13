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

watch(response, () => {
  console.log(response.value?.items)
})
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
        <Command.List>
          <Command.Empty>Type to search repo.</Command.Empty>
          <Command.Group v-if="response" heading="">
            <Command.Item v-for="item in response.items"
                          @select="()=>{
                            openUrl(item.html_url)
                          }"
                          :data-value="item.name">
              <img :src="item.owner.avatar_url" alt="owner avater" class="w-6 h-6 mr-2"/>
              {{ item.full_name }}
            </Command.Item>
          </Command.Group>

        </Command.List>
      </template>
    </Command.Dialog>
  </div>
</template>

<style>
</style>
