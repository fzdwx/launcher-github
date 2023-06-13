<script lang="ts" setup>
import {Command, onUserInput, useCommandEvent, useDebouncedRef} from "@fzdwx/launcher-api";
import {watch} from "vue";

let commandEvent = useCommandEvent();

const debouncedUserInput = useDebouncedRef('', 500);
onUserInput('github-repository-search', (s) => {
  commandEvent.emitter.emit('setInputValue', s)
  debouncedUserInput.value = s;
})

watch(debouncedUserInput, (value) => {
  console.log(value)
})
</script>

<template>
  <div class="body dark">
    <Command.Dialog :visible="true" theme="raycast">
      <template #header>
        <div class="hidden">
          <Command.Input/>
        </div>
      </template>
      <template #body>
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>

          <Command.Group heading="Letters">
            <Command.Item data-value="a">a</Command.Item>
            <Command.Item data-value="b">b</Command.Item>
            <Command.Separator/>
            <Command.Item data-value="c">c</Command.Item>
          </Command.Group>

          <Command.Item data-value="apple">Apple</Command.Item>
        </Command.List>
      </template>
    </Command.Dialog>
  </div>
</template>

<style>
</style>
