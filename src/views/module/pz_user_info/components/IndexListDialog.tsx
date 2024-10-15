import { Dialog } from '@axm-pack/manage-render'
import { defineComponent, reactive, ref } from 'vue'
import { QueryForm, DataTable } from '@axm-pack/manage-render'
import service from '@/utils/request'
import EditIndexDialog from './EditIndexDialog'

const roles = [
	{ label: '嘉宾', value: '3' },
	{ label: '会员', value: '4' },
	{ label: '顾问团', value: '5' }
]

const DialogContent = defineComponent({
	setup() {
		const queryForm = ref<any>({
			status: '3',
			asc: true,
			order: 'role_index',
			name: '',
			account: '',
			page: 1,
			limit: 10
		})
		const tableData = ref([])
		const loading = ref(false)
		const total = ref(0)

		const QueryFormNode = QueryForm<{ status?: string }>({
			modelValue: queryForm,
			formItems: [
				{
					label: '角色分组',
					key: 'status',
					type: () => {
						return (
							<el-select modelValue={queryForm.value.status}>
								{roles.map(item => (
									<el-option label={item.label} value={item.value} />
								))}
							</el-select>
						)
					}
				}
			],
			actions: [
				{
					text: '查询',
					type: 'primary',
					handler: () => {
						queryForm.value.page = 1
						loadData()
					}
				}
			]
		})

		const DataTableNode = DataTable({
			items: tableData,
			pagination: {
				pageNum: () => queryForm.value.page,
				pageSize: () => queryForm.value.limit
			},
			dataFetch: (pageNum,pageSize) => {
				queryForm.value.page = pageNum
				queryForm.value.limit = pageSize
				loadData()
			},
			loading,
			total,
			columns: [
				{
					label: '姓名',
					key: 'name'
				},
				{
					label: '行业',
					key: 'industry'
				},
				{
					label: '公司',
					key: 'company'
				},
				{
					label: '排序',
					key: 'roleIndex'
				}
			],
			action: {
				width: 100,
				items: [
					{
						text: '编辑排序',
						type: 'primary',
						onClick: item => {
							EditIndexDialog.show({
								item,
								reload: loadData
							})
						}
					}
				]
			}
		})

		const loadData = () => {
			loading.value = true
			service
				.get('/module/pz_user_info/page', {
					params: queryForm.value
				})
				.then(res => {
					tableData.value = res.data.list || []
					total.value = res.data.total || 0
				})
				.finally(() => {
					loading.value = false
				})
		}

		loadData()

		return {
			QueryFormNode,
			DataTableNode
		}
	},
	render() {
		return (
			<div class='px-[20px]'>
				{this.QueryFormNode}
				{this.DataTableNode}
			</div>
		)
	}
})

const show = () => {
	const instance = Dialog.init({
		title: '排序编辑',
		width: 700,
		content: () => <DialogContent />
	})
}

export default { show }
