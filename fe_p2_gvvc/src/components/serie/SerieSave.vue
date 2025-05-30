<script setup lang="ts">
import type { Pais } from '@/models/pais'
import type { Serie } from '@/models/serie'
import http from '@/plugins/axios'
import Select from 'primevue/select'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import { computed, ref, watch } from 'vue'
import { DatePicker } from 'primevue'

const ENDPOINT = 'series'
const props = defineProps({
  mostrar: Boolean,
  serie: {
    type: Object as () => Serie,
    default: () => ({}) as Serie,
  },
  modoEdicion: Boolean,
})
const emit = defineEmits(['guardar', 'close'])

const paises = ref<Pais[]>([])

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) emit('close')
  },
})

const serie = ref<Serie>({ ...props.serie })
const idiomas = ['Español', 'Inglés', 'Chino', 'Coreano']

async function obtenerPaises() {
  paises.value = await http.get('paises').then((response) => response.data)
}
watch(
  () => props.mostrar,
  (nuevoValor) => {
    if (nuevoValor) {
      obtenerPaises()
      if (props.serie?.id) {
        serie.value = {
          ...props.serie,
          idPais: props.serie.pais?.id ?? 0,
          fechaEstreno:
            typeof props.serie.fechaEstreno === 'string'
              ? new Date(props.serie.fechaEstreno)
              : props.serie.fechaEstreno,
          idiomaPrincipal:
            idiomas.find(
              (idioma) =>
                idioma.toLowerCase() === (props.serie.idiomaPrincipal?.toLowerCase() ?? ''),
            ) ?? '',
        }
      } else {
        serie.value = {} as Serie
      }
    }
  },
)

async function handleSave() {
  try {
    const body = {
      idPais: serie.value.idPais,
      titulo: serie.value.titulo,
      sinopsis: serie.value.sinopsis,
      director: serie.value.director,
      temporadas: serie.value.temporadas,
      fechaEstreno: serie.value.fechaEstreno.toISOString(),
      idiomaPrincipal: serie.value.idiomaPrincipal,
    }
    console.log('Datos que envío:', body)
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${serie.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    serie.value = {} as Serie
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message)
  }
}
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="(props.modoEdicion ? 'Editar' : 'Crear') + ' Serie'"
      style="width: 25rem"
    >
      <div class="flex items-center gap-4 mb-4">
        <label for="pais" class="font-semibold w-3">País</label>
        <Select
          id="pais"
          v-model="serie.idPais"
          :options="paises"
          optionLabel="descripcion"
          optionValue="id"
          class="flex-auto"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="titulo" class="font-semibold w-3">Título</label>
        <InputText id="titulo" v-model="serie.titulo" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="sinopsis" class="font-semibold w-3">Sinopsis</label>
        <Textarea id="sinopsis" v-model="serie.sinopsis" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="director" class="font-semibold w-3">Director</label>
        <InputText id="director" v-model="serie.director" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="temporadas" class="font-semibold w-3">Temporadas</label>
        <InputNumber
          id="temporadas"
          v-model="serie.temporadas"
          class="flex-auto"
          autocomplete="off"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="fechaEstreno" class="font-semibold w-3">Fecha de Estreno</label>
        <DatePicker
          id="fechaEstreno"
          v-model="serie.fechaEstreno"
          class="flex-auto"
          date-format="yy-mm-dd"
          show-icon
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="idiomaPrincipal" class="font-semibold w-3">Idioma Principal</label>
        <Select
          id="idiomaPrincipal"
          v-model="serie.idiomaPrincipal"
          :options="idiomas"
          placeholder="Seleccionar un Idioma"
          class="flex-auto"
        />
      </div>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          icon="pi pi-times"
          severity="secondary"
          @click="dialogVisible = false"
        ></Button>
        <Button type="button" label="Guardar" icon="pi pi-save" @click="handleSave"></Button>
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
