import type { Block, Config, Field } from 'payload'

const ROW_LABEL = '/components/admin/RowLabel#RowLabel'
// Text fields tried, in order, for a row's label.
const LABEL_FIELDS = ['title', 'label', 'name', 'question', 'city', 'value', 'network', 'text']

function walk(fields: Field[] | undefined): void {
  for (const field of fields ?? []) {
    if (field.type === 'array') {
      field.admin = field.admin ?? {}
      field.admin.components = field.admin.components ?? {}
      if (!field.admin.components.RowLabel) {
        field.admin.components.RowLabel = { path: ROW_LABEL, clientProps: { fields: LABEL_FIELDS } }
      }
      walk(field.fields)
    } else if (field.type === 'group' || field.type === 'row' || field.type === 'collapsible') {
      walk(field.fields)
    } else if (field.type === 'tabs') {
      for (const tab of field.tabs) walk(tab.fields)
    } else if (field.type === 'blocks') {
      for (const block of (field.blocks ?? []) as Block[]) walk(block.fields)
    }
  }
}

/**
 * Plugin: every array field in the admin shows its row's own text ("About",
 * "Sahulat (Easy) Account", the FAQ question…) instead of "Item 01".
 */
export const rowLabels = (config: Config): Config => {
  for (const c of config.collections ?? []) walk(c.fields)
  for (const g of config.globals ?? []) walk(g.fields)
  return config
}
