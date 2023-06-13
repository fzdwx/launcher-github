import type {SearchRepositoriesResponse} from "@/use/types";
import {reactive, ref, type Ref, toRefs, watch, watchEffect} from "vue";

export function useRepositories(searchText: Ref<string>, ghToken: string) {
    const loading = ref<boolean>(false);
    const error = ref<Error>();
    const response = ref<SearchRepositoriesResponse>();

    async function search(searchText: string) {
        if (searchText.length === 0) {
            loading.value = false
            return;
        }

        loading.value = true;
        try {
            const url = `https://api.github.com/search/repositories?q=${searchText}`;
            let resp = await fetch(url, {
                headers: {
                    'Accept': 'application/vnd.github+json',
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            });

            response.value = await resp.json();
        } catch (e: any) {
            error.value = e;
        } finally {
            loading.value = false;
        }
    }

    watch(searchText, async () => {
        await search(searchText.value);
    });

    return {
        loading, response, error
    }

}
