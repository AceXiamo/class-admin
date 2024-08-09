import { Dialog } from '@axm-pack/manage-render'
import { defineComponent, PropType, ref } from 'vue'
import { DataForm } from '@axm-pack/manage-render'
import { usePz_user_infoSubmitApi } from '@/api/module/pz_user_info'
import { dayjs, ElMessage } from 'element-plus'

const DialogContent = defineComponent({
	props: {
		item: {
			type: Object as PropType<any>,
			default: () => ({})
		},
		reload: {
			type: Function as PropType<() => void>,
			required: true
		},
		close: {
			type: Function as PropType<() => void>,
			required: false
		}
	},
	setup(props) {
		const form = ref<any>(props.item)

		const DataFormNode = DataForm({
			modelValue: form,
			labelWidth: 40,
			formItems: [
				{
					label: '排序',
					key: 'roleIndex'
				}
			],
			actions: [
				{
					text: '取消',
					type: 'primary',
					handler: () => {
						props.close?.()
					}
				},
				{
					text: '保存',
					type: 'primary',
					handler: () => {
						let param = new FormData()
						const formValue = {
							...form.value
						}
						form.value.createTime && (formValue.createTime = dayjs(form.value.createTime).format('YYYY-MM-DD HH:mm:ss'))
						form.value.updateTime && (formValue.updateTime = dayjs(form.value.updateTime).format('YYYY-MM-DD HH:mm:ss'))
						form.value.joinTime && (formValue.joinTime = dayjs(form.value.joinTime).format('YYYY-MM-DD HH:mm:ss'))
						let jsonStr = JSON.stringify(formValue)
						const blob = new Blob([jsonStr], { type: 'application/json' })

						param.append('avatar', new Blob([''], { type: 'application/octet-stream' }))
						param.append('qrCode', new Blob([''], { type: 'application/octet-stream' }))
						param.append('vo', blob)

						usePz_user_infoSubmitApi(param, form.value.id).then(() => {
							ElMessage.success('操作成功')
							props.reload()
							props.close?.()
						})
					}
				}
			]
		})

		return {
			DataFormNode
		}
	},
	render() {
		return <div class='px-[20px]'>{this.DataFormNode}</div>
	}
})

const show = ({ item, reload }: any) => {
	const instance = Dialog.init({
		title: '排序编辑',
		width: 300,
		content: () => (
			<DialogContent
				item={{
					...item
				}}
				reload={reload}
				close={instance?.close}
			/>
		)
	})
}

export default { show }
