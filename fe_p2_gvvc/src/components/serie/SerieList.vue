<script setup lang="ts">
import type { Serie } from '@/models/serie'
import http from '@/plugins/axios'
import { Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import Button from 'primevue/button'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'series'
const series = ref<Serie[]>([])
const emit = defineEmits(['edit'])
const serieDelete = ref<Serie | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')

async function obtenerLista() {
  series.value = await http.get(ENDPOINT).then((response) => response.data)
}

const seriesFiltrados = computed(() => {
  return series.value.filter(
    (serie) =>
      serie.titulo.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      serie.sinopsis.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      serie.pais.descripcion.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      serie.director.toLowerCase().includes(busqueda.value.toLowerCase()),
  )
})

function emitirEdicion(serie: Serie) {
  emit('edit', serie)
}

function mostrarEliminarConfirm(serie: Serie) {
  serieDelete.value = serie
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${serieDelete.value?.id}`)
  obtenerLista()
  mostrarConfirmDialog.value = false
}

onMounted(() => {
  obtenerLista()
})
defineExpose({ obtenerLista })
</script>

<template>
  <div>
    <div>
      <div class="col-7 pl-0 mt-3">
        <InputGroup>
          <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
          <InputText
            v-model="busqueda"
            type="text"
            placeholder="Buscar por título, sinopsis, director o país"
          />
        </InputGroup>
      </div>
      <table>
        <thead>
          <tr>
            <th>Nro.</th>
            <th>Pais</th>
            <th>Título</th>
            <th>Sinopsis</th>
            <th>Director</th>
            <th>Temporadas</th>
            <th>Fecha de Estreno</th>
            <th>Idioma Principal</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(serie, index) in seriesFiltrados" :key="serie.id">
            <td>{{ index + 1 }}</td>
            <td>{{ serie.pais.descripcion }}</td>
            <td>{{ serie.titulo }}</td>
            <td>{{ serie.sinopsis }}</td>
            <td>{{ serie.director }}</td>
            <td>{{ serie.temporadas }}</td>
            <td>{{ serie.fechaEstreno }}</td>
            <td>{{ serie.idiomaPrincipal }}</td>
            <td>
              <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(serie)" />
              <Button
                icon="pi pi-trash"
                aria-label="Eliminar"
                severity="danger"
                text
                @click="mostrarEliminarConfirm(serie)"
              />
            </td>
          </tr>
          <tr v-if="seriesFiltrados.length === 0">
            <td colspan="4">No se encontraron resultados.</td>
          </tr>
        </tbody>
      </table>
      <Dialog
        v-model:visible="mostrarConfirmDialog"
        header="Confirmar Eliminación"
        :style="{ width: '25rem' }"
      >
        <p>¿Estás seguro de que deseas eliminar este registro?</p>
        <div class="flex justify-end gap-2">
          <Button
            type="button"
            label="Cancelar"
            severity="secondary"
            @click="mostrarConfirmDialog = false"
          />
          <Button type="button" label="Eliminar" @click="eliminar" />
        </div>
      </Dialog>
    </div>
  </div>
</template>

<style scoped></style>
