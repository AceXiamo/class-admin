<template>
	<el-card>
		<div style="diplay: flex; align-item: center; margin-bottom: 20px">
			<svg-icon icon="icon-rollback" @click="router.back()" size="20px"></svg-icon>
			<span style="margin-left: 16px; font-size: 32px">用户数据</span>
		</div>
		<div style="margin-bottom: 20px">
			{{ route.query.name }}
		</div>

		<div style="margin-bottom: 20px">
			<el-button v-auth="'module:pz_user_info:export'" type="primary" @click="exportDataHandle(route.query.id)">导出</el-button>
		</div>

		<div style="margin-bottom: 20px">
			<div style="margin-bottom: 10px">收到的引荐记录</div>
			<el-table :loading="recommendListLoading" :data="receivedRecommendList" border style="width: 100%">
				<el-table-column prop="recommendTime" label="引荐日期" header-align="center" align="center">
					<template #default="{ row }">
						{{ row.recommendTime ? dayjs(row.recommendTime).format('YYYY-MM-DD') : '' }}
					</template>
				</el-table-column>
				<!-- <el-table-column prop="recommenderId" label="引荐人id" header-align="center" align="center"></el-table-column>
            <el-table-column prop="recommendedId" label="被引荐人id" header-align="center" align="center"></el-table-column> -->
				<el-table-column prop="recommenderName" label="引荐人" header-align="center" align="center"></el-table-column>
				<el-table-column prop="recommendedName" label="被引荐人" header-align="center" align="center"></el-table-column>
				<el-table-column prop="type" label="引荐类型" header-align="center" align="center"></el-table-column>
				<el-table-column prop="recommendContent" label="引荐内容" header-align="center" align="center"></el-table-column>
				<el-table-column prop="dealTime" label="成交日期" header-align="center" align="center">
					<template #default="{ row }">
						{{ row.dealTime ? dayjs(row.dealTime).format('YYYY-MM-DD') : '' }}
					</template>
				</el-table-column>
				<el-table-column prop="dealContent" label="成交内容" header-align="center" align="center"></el-table-column>
				<el-table-column prop="dealAmout" label="成交金额" header-align="center" align="center"></el-table-column>
				<el-table-column prop="comment" label="感谢函评语" header-align="center" align="center"></el-table-column>
				<el-table-column prop="status" label="是否群发感谢函" header-align="center" align="center">
					<template #default="{ row }">
						{{ row.status == 1 ? '是' : '否' }}
					</template>
				</el-table-column>
				<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
					<template #default="scope">
						<el-button v-auth="'module:pz_recommend:update'" type="primary" link @click="recommendAddOrUpdateHandle(scope.row.id)">修改</el-button>
						<el-button v-auth="'module:pz_recommend:delete'" type="danger" link @click="deleteRecommendHandle(scope.row.id)">删除</el-button>
					</template>
				</el-table-column>
				<!-- <el-table-column prop="createTime" label="创建时间" header-align="center" align="center"></el-table-column> -->
			</el-table>
		</div>

		<div style="margin-bottom: 20px">
			<div style="margin-bottom: 10px">给出的引荐记录</div>
			<el-table :loading="recommendListLoading" :data="givenRecommendList" border style="width: 100%">
				<el-table-column prop="recommendTime" label="引荐日期" header-align="center" align="center">
					<template #default="{ row }">
						{{ row.recommendTime ? dayjs(row.recommendTime).format('YYYY-MM-DD') : '' }}
					</template>
				</el-table-column>
				<!-- <el-table-column prop="recommenderId" label="引荐人id" header-align="center" align="center"></el-table-column>
            <el-table-column prop="recommendedId" label="被引荐人id" header-align="center" align="center"></el-table-column> -->
				<el-table-column prop="recommenderName" label="引荐人" header-align="center" align="center"></el-table-column>
				<el-table-column prop="recommendedName" label="被引荐人" header-align="center" align="center"></el-table-column>
				<el-table-column prop="type" label="引荐类型" header-align="center" align="center"></el-table-column>
				<el-table-column prop="recommendContent" label="引荐内容" header-align="center" align="center"></el-table-column>
				<el-table-column prop="dealTime" label="成交日期" header-align="center" align="center">
					<template #default="{ row }">
						{{ row.dealTime ? dayjs(row.dealTime).format('YYYY-MM-DD') : '' }}
					</template>
				</el-table-column>
				<el-table-column prop="dealContent" label="成交内容" header-align="center" align="center"></el-table-column>
				<el-table-column prop="dealAmout" label="成交金额" header-align="center" align="center"></el-table-column>
				<el-table-column prop="comment" label="感谢函评语" header-align="center" align="center"></el-table-column>
				<el-table-column prop="status" label="是否群发感谢函" header-align="center" align="center">
					<template #default="{ row }">
						{{ row.status == 1 ? '是' : '否' }}
					</template>
				</el-table-column>
				<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
					<template #default="scope">
						<el-button v-auth="'module:pz_recommend:update'" type="primary" link @click="recommendAddOrUpdateHandle(scope.row.id)">修改</el-button>
						<el-button v-auth="'module:pz_recommend:delete'" type="danger" link @click="deleteRecommendHandle(scope.row.id)">删除</el-button>
					</template>
				</el-table-column>
				<!-- <el-table-column prop="createTime" label="创建时间" header-align="center" align="center"></el-table-column> -->
			</el-table>
		</div>

		<div style="margin-bottom: 20px">
			<div style="margin-bottom: 10px">走访记录</div>
			<el-table :data="state.visitList" border style="width: 100%">
				<el-table-column prop="visitTime" label="走访时间" header-align="center" align="center">
					<template #default="{ row }">
						{{ row.visitTime ? dayjs(row.visitTime).format('YYYY-MM-DD') : '' }}
					</template>
				</el-table-column>
				<el-table-column prop="visitorNames" label="走访人" header-align="center" align="center"></el-table-column>
				<el-table-column prop="visitedName" label="被走访人" header-align="center" align="center"></el-table-column>
				<el-table-column prop="type" label="走访类型" header-align="center" align="center">
					<template #default="{ row }">
						{{ row.type === 0 ? '点对点走访' : '集体走访' }}
					</template>
				</el-table-column>
				<el-table-column prop="content" label="走访内容" header-align="center" align="center"></el-table-column>
				<el-table-column prop="comment" label="走访情况" header-align="center" align="center"></el-table-column>
				<el-table-column prop="status" label="是否群发走访" header-align="center" align="center">
					<template #default="{ row }">
						{{ row.status == 1 ? '是' : '否' }}
					</template>
				</el-table-column>
				<!-- <el-table-column prop="createTime" label="" header-align="center" align="center"></el-table-column>
			<el-table-column prop="updateTime" label="" header-align="center" align="center"></el-table-column> -->
				<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
					<template #default="scope">
						<el-button v-auth="'module:pz_visit:update'" type="primary" link @click="visitAddOrUpdateHandle(scope.row.id)">修改</el-button>
						<el-button v-auth="'module:pz_visit:delete'" type="danger" link @click="deleteVisitHandle(scope.row.id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<div style="margin-bottom: 20px">
			<div style="margin-bottom: 10px">活动记录</div>
			<el-table :data="state.eventList" border style="width: 100%">
				<el-table-column prop="eventTime" label="活动时间" header-align="center" align="center"></el-table-column>
				<el-table-column prop="theme" label="活动主题" header-align="center" align="center"></el-table-column>
				<el-table-column prop="status" label="是否上架" header-align="center" align="center"></el-table-column>
				<el-table-column prop="type" label="活动类型" header-align="center" align="center"></el-table-column>
				<el-table-column prop="createTime" label="发布时间" header-align="center" align="center"></el-table-column>

				<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
					<template #default="scope">
						<el-button v-auth="'module:pz_recommend:update'" type="primary" link @click="eventAddOrUpdateHandle(scope.row.id)">修改</el-button>
						<el-button v-auth="'module:pz_recommend:delete'" type="danger" link @click="deleteEventHandle(scope.row.id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<div style="margin-bottom: 20px">
			<div style="margin-bottom: 10px">嘉宾记录</div>
			<el-table :data="state.recommenderList" border style="width: 100%">
				<el-table-column prop="name" label="用户姓名" header-align="center" align="center"></el-table-column>
				<el-table-column prop="status" label="用户角色状态" header-align="center" align="center"></el-table-column>
				<!-- <el-table-column prop="account" label="用户关联登录手机号" header-align="center" align="center"></el-table-column>
			<el-table-column prop="sex" label="用户性别" header-align="center" align="center"></el-table-column>
			<el-table-column prop="homeplace" label="家乡" header-align="center" align="center"></el-table-column>
			<el-table-column prop="college" label="用户大学/年级/专业" header-align="center" align="center"></el-table-column> -->
				<el-table-column prop="industry" label="行业" header-align="center" align="center"></el-table-column>
				<el-table-column prop="company" label="公司" header-align="center" align="center"></el-table-column>
				<el-table-column prop="position" label="职位" header-align="center" align="center"></el-table-column>
				<!-- <el-table-column prop="tags" label="用户自定义标签" header-align="center" align="center">
				<template #default="{ row }">
					<el-tag v-for="tag in JSON.parse(row.tags||'[]')" :key="tag" closable :disable-transitions="false"
						@close="handleClose(tag,row)" effect="plain">
						{{ tag }}
					</el-tag>
					<el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" class="w-20" size="small"
						@keyup.enter="handleInputConfirm(row)" @blur="handleInputConfirm(row)" />
					<el-button v-else class="button-new-tag" size="small" @click="showInput">
						+ 添加
					</el-button>
				</template>
			</el-table-column> -->
				<el-table-column prop="createTime" label="创建时间" header-align="center" align="center">
					<template #default="{ row }">
						{{ row.createTime ? dayjs(row.createTime).format('YYYY-MM-DD') : '' }}
					</template>
				</el-table-column>
				<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
					<template #default="scope">
						<el-button v-auth="'module:pz_recommend:update'" type="primary" link @click="userInfoAddOrUpdateHandle(scope.row.id)">修改</el-button>
						<el-button v-auth="'module:pz_recommend:delete'" type="danger" link @click="deleteUserInfoHandle(scope.row.id)">删除</el-button>
					</template>
				</el-table-column>
				<!-- <el-table-column prop="updateTime" label="修改时间" header-align="center" align="center"></el-table-column> -->
			</el-table>
		</div>
		<recommend-add-or-update ref="recommendAddOrUpdate" @refresh="getRecommendList"></recommend-add-or-update>
		<visit-add-or-update ref="visitAddOrUpdate" @refresh="getVisitList"></visit-add-or-update>
		<event-add-or-update ref="eventAddOrUpdate" @refresh="getEventList"></event-add-or-update>
		<user-info-add-or-update ref="userInfoAddOrUpdate" @refresh="getRecommenderList"></user-info-add-or-update>
	</el-card>
</template>

<script setup lang="ts" name="ModulePz_user_infoRecord">
import svgIcon from '@/components/svg-icon'
import { useRoute, useRouter } from 'vue-router'
import { usePz_recommendUserApi, usePz_recommendDeleteApi } from '@/api/module/pz_recommend'
import { usePz_visitUserApi, usePz_visitDeleteApi } from '@/api/module/pz_visit'
import { usePz_eventUserApi, usePz_eventDeleteApi } from '@/api/module/pz_event'
import { usePz_user_infoUserApi, usePz_user_infoDeleteApi } from '@/api/module/pz_user_info'
import { reactive, ref } from 'vue'
import { onMounted } from 'vue'
import { computed } from 'vue'
import { ElMessage, ElMessageBox, dayjs } from 'element-plus'
import RecommendAddOrUpdate from '@/views/module/pz_recommend/add-or-update.vue'
import VisitAddOrUpdate from '@/views/module/pz_visit/add-or-update.vue'
import EventAddOrUpdate from '@/views/module/pz_event/add-or-update.vue'
import UserInfoAddOrUpdate from '@/views/module/pz_user_info/add-or-update.vue'
import { get } from 'sortablejs'
import { number } from 'echarts'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'

const Curstate: IHooksOptions = reactive({
	dataListUrl: '/module/pz_user_info/page',
	deleteUrl: '/module/pz_user_info',
	queryForm: {
		name: '',
		status: ''
	}
})

const router = useRouter()
const route = useRoute()

const state = reactive({
	recommendList: [],
	visitList: [],
	eventList: [],
	recommenderList: []
})

const recommendListLoading = ref(false)
// 获取用户的引荐记录列表
const getRecommendList = () => {
	recommendListLoading.value = true
	usePz_recommendUserApi(route.query.id).then(res => {
		state.recommendList = res.data
		recommendListLoading.value = false
	})
}
// 收到的引荐记录
const receivedRecommendList = computed(() => {
	return state.recommendList.filter(item => {
		return item.recommendedId == route.query.id
	})
})
// 给出的引荐记录
const givenRecommendList = computed(() => {
	return state.recommendList.filter(item => {
		return item.recommenderId == route.query.id
	})
})

// 获取用户的走访记录列表
const getVisitList = () => {
	usePz_visitUserApi(route.query.id).then(res => {
		state.visitList = res.data
	})
}

// 获取用户的活动记录列表
const getEventList = () => {
	usePz_eventUserApi(route.query.id).then(res => {
		state.eventList = res.data
	})
}

// 获取用户的嘉宾记录列表
const getRecommenderList = () => {
	usePz_user_infoUserApi(route.query.id).then(res => {
		state.recommenderList = res.data
	})
}

// 导出用户数据
const exportDataHandle = (id: number) => {
	downloadHandle('module/pz_user_info/exportData/' + id).then(res => {
		ElMessage.success('导出成功')
	})
}

// 引荐编辑弹窗
const recommendAddOrUpdate = ref()
const recommendAddOrUpdateHandle = (id?: number) => {
	recommendAddOrUpdate.value.init(id)
}
const deleteRecommendHandle = (id: number) => {
	ElMessageBox.confirm('确定进行删除操作?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	})
		.then(() => {
			usePz_recommendDeleteApi(id).then(res => {
				ElMessage.success('删除成功')
				getRecommendList()
			})
		})
		.catch(() => {})
}

// 走访编辑弹窗
const visitAddOrUpdate = ref()
const visitAddOrUpdateHandle = (id?: number) => {
	visitAddOrUpdate.value.init(id)
}
const deleteVisitHandle = (id: number) => {
	ElMessageBox.confirm('确定进行删除操作?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	})
		.then(() => {
			usePz_visitDeleteApi(id).then(res => {
				ElMessage.success('删除成功')
				getVisitList()
			})
		})
		.catch(() => {})
}

// 活动编辑弹窗
const eventAddOrUpdate = ref()
const eventAddOrUpdateHandle = (id: number) => {
	eventAddOrUpdate.value.init(id)
}
const deleteEventHandle = (id: number) => {
	ElMessageBox.confirm('确定进行删除操作?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	})
		.then(() => {
			usePz_eventDeleteApi(id).then(res => {
				ElMessage.success('删除成功')
				getVisitList()
			})
		})
		.catch(() => {})
}

// 嘉宾编辑弹窗
const userInfoAddOrUpdate = ref()
const userInfoAddOrUpdateHandle = (id: number) => {
	userInfoAddOrUpdate.value.init(id)
}
const deleteUserInfoHandle = (id: number) => {
	ElMessageBox.confirm('确定进行删除操作?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	})
		.then(() => {
			usePz_eventDeleteApi(id).then(res => {
				ElMessage.success('删除成功')
				getVisitList()
			})
		})
		.catch(() => {})
}

const getDataList = () => {
	getRecommendList()
	getVisitList()
	getEventList()
	getRecommenderList()
}

onMounted(() => {
	getDataList()
})

const { downloadHandle } = useCrud(Curstate)
</script>
