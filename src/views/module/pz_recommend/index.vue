<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item label="日期筛选">
				<el-date-picker v-model="dateRange" type="daterange" range-separator="到" start-placeholder="请选择日期"
					end-placeholder="请选择日期" @change="handleDateChange" value-format="YYYY-MM-DD HH:mm:ss"></el-date-picker>
			</el-form-item>
			<el-form-item label="引荐人" prop="recommenderId" style="width: 200px;">
				<!-- <el-input v-model="state.queryForm.recommenderId" clearable placeholder="请输入引荐人id"></el-input> -->
				<el-select v-model="state.queryForm.recommenderId" clearable filterable placeholder="引荐人">
					<el-option v-for="item in userInfoList" :key="item.id" :label="item.name" :value="item.id"/>
				</el-select>
			</el-form-item>
			<el-form-item label="被引荐人" prop="recommendedId" style="width: 200px;">
				<!-- <el-input v-model="state.queryForm.recommendedId" clearable placeholder="请输入被引荐人id"></el-input> -->
				<el-select v-model="state.queryForm.recommendedId" clearable filterable placeholder="被引荐人">
					<el-option v-for="item in userInfoList" :key="item.id" :label="item.name" :value="item.id"/>
				</el-select>
			</el-form-item>
			<el-form-item label="引荐类型" prop="type" style="width: 200px;">
				<el-select v-model="state.queryForm.type" clearable placeholder="请选择引荐类型">
					<el-option label="内部引荐" value="0"></el-option>
					<el-option label="外部引荐" value="1"></el-option>
					<el-option label="全部" value=""></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="成交金额" prop="amount">
				<el-input v-model="state.queryForm.amountStart" clearable placeholder="金额起" style="width: 100px;"></el-input>
				<span style="padding-left: 10px; padding-right: 10px;"> - </span>
				<el-input v-model="state.queryForm.amountEnd" clearable placeholder="金额终" style="width: 100px;"></el-input>
			</el-form-item>

			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'module:pz_recommend:save'" type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'module:pz_recommend:export'" type="primary" @click="exportHandle()">导出</el-button>
			</el-form-item>
			<!-- <el-form-item>
				<el-button v-auth="'module:pz_recommend:delete'" type="danger" @click="deleteBatchHandle()">删除</el-button>
			</el-form-item> -->
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%"
			@selection-change="selectionChangeHandle">
			<!-- <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="id" label="" header-align="center" align="center"></el-table-column> -->
			<el-table-column prop="recommendTime" label="引荐日期" header-align="center" align="center">
				<template #default="{ row }">
					{{ row.recommendTime ? dayjs(row.recommendTime).format('YYYY-MM-DD') : '' }}
				</template>
			</el-table-column>
			<el-table-column prop="recommenderName" label="引荐人" header-align="center" align="center"></el-table-column>
			<el-table-column prop="recommendedName" label="被引荐人" header-align="center" align="center"></el-table-column>
			<el-table-column prop="type" label="引荐类型" header-align="center" align="center">
				<template #default="{row}">
					{{ row.type==0?'内部引荐':'外部引荐' }}
				</template>
			</el-table-column>
			<el-table-column prop="recommendContent" label="引荐内容" header-align="center" align="center"></el-table-column>
			<el-table-column prop="dealTime" label="成交日期" header-align="center" align="center">
				<template #default="{ row }">
					{{ row.dealTime ? dayjs(row.dealTime).format('YYYY-MM-DD') : '' }}
				</template>
			</el-table-column>
			<el-table-column prop="dealContent" label="成交内容" header-align="center" align="center"></el-table-column>
			<el-table-column prop="dealAmout" label="成交金额" header-align="center" align="center"></el-table-column>
			<el-table-column prop="comment" label="感谢函评语" header-align="center" align="center"></el-table-column>
			<el-table-column prop="status" label="是否群发感谢函" header-align="center" align="center"></el-table-column>
			<!-- <el-table-column prop="createTime" label="" header-align="center" align="center"></el-table-column>
			<el-table-column prop="updateTime" label="" header-align="center" align="center"></el-table-column> -->
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button v-auth="'module:pz_recommend:update'" type="primary" link
						@click="addOrUpdateHandle(scope.row.id)">修改</el-button>
					<el-button v-auth="'module:pz_recommend:delete'" type="primary" link
						@click="deleteBatchHandle(scope.row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :current-page="state.page" :page-sizes="state.pageSizes" :page-size="state.limit"
			:total="state.total" layout="total, sizes, prev, pager, next, jumper" @size-change="sizeChangeHandle"
			@current-change="currentChangeHandle">
		</el-pagination>

		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update ref="addOrUpdateRef" @refreshDataList="getDataList"></add-or-update>
	</el-card>
</template>

<script setup lang="ts" name="ModulePz_recommendIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import AddOrUpdate from './add-or-update.vue'
import { usePz_user_infoAllApi } from '@/api/module/pz_user_info'
import { onMounted } from 'vue'
import { ElMessage, dayjs } from 'element-plus'

const state: IHooksOptions = reactive({
	dataListUrl: '/module/pz_recommend/page',
	deleteUrl: '/module/pz_recommend',
	queryForm: {
		startTime: null,
		endTime: null,
		recommenderId: '',
		recommendedId: '',
		type: '',
		amountStart: '',
		amountEnd: '',
	}
})

const dateRange = ref([])

const handleDateChange = (value) => {
	if (value === null) {
		state.queryForm.startTime = ''
		state.queryForm.endTime = ''
		return
	}
	state.queryForm.startTime = value[0]
	state.queryForm.endTime = value[1]
	dateRange.value = value
}

const userInfoList = ref([])
const getPz_userInfoList=()=>{
	usePz_user_infoAllApi().then(res=>{
		userInfoList.value = res.data
	})
}
onMounted(()=>{
	getPz_userInfoList()
})

const exportHandle = () => {
	downloadHandle('/module/pz_recommend/export?startTime='+(state.queryForm.startTime?state.queryForm.startTime:'')+'&endTime='
	+(state.queryForm.endTime?state.queryForm.endTime:'')+'&recommenderId='+state.queryForm.recommenderId+'&recommendedId='+state.queryForm.recommendedId
	+'&type='+state.queryForm.type+'&amountStart='+state.queryForm.amountStart+'&amountEnd='+state.queryForm.amountEnd).then(()=>{
		ElMessage.success('导出成功')
	})
}


const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, downloadHandle } = useCrud(state)
</script>
