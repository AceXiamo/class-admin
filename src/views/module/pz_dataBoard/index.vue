<template>
	<el-card>
		<!-- <div style="display: flex; justify-content:center;">
            <div style="margin: 10px; width: 48%;">
                <div style="display: flex; align-items: center; margin: 8px;">
                    <div style="margin-right: 8px;">综合得分榜</div>
                </div>
                <div class="fold-table" :style="{height: showAll || arr.length < 5 ?'auto':'200px'}">
                    <el-table v-loading="averageScoreListLoading" :data="arr" border>
                    <el-table-column prop="name" label="姓名" header-align="center" align="center"></el-table-column>
                    <el-table-column prop="averageScore" label="总分" header-align="center"
                        align="center"></el-table-column>
                    <el-table-column prop="recommenderNum" label="引荐" header-align="center"
                        align="center"></el-table-column>
                    <el-table-column prop="guestNum" label="嘉宾" header-align="center" align="center"></el-table-column>
                    <el-table-column prop="visitNum" label="走访" header-align="center" align="center"></el-table-column>
                    <el-table-column prop="attendance" label="出勤" header-align="center"
                        align="center"></el-table-column>
                    </el-table>
                </div>
                <div v-if="arr.length > 5" class="ctrl-btn" @click="showAll = !showAll">{{ showAll ? '收起' : '展开全部' }} <el-icon><ArrowUp v-if="showAll" /> <ArrowDown v-else /></el-icon></div>
            </div>
        </div> -->
		<div style="display: flex; justify-content: center">
			<div style="margin: 10px; width: 48%">
				<div style="display: flex; align-items: center; margin: 8px">
					<div style="margin-right: 8px">综合得分榜</div>
					<el-date-picker
						v-model="averageScoreListTime"
						type="month"
						:clearable="false"
						style="width: 150px"
						placeholder="选择月份"
						format="YYYY年MM月"
						value-format="YYYY-MM"
						@change="handleAverageScoreListTime"
					>
					</el-date-picker>
				</div>
				<div class="fold-table" :style="{ height: averageScoreShowAll || averageScoreList.length < 5 ? 'auto' : '200px' }">
					<el-table v-loading="averageScoreListLoading" :data="averageScoreList" border>
						<!-- <el-table-column prop="id" label="id" header-align="center" align="center"></el-table-column> -->
						<el-table-column prop="name" label="姓名" header-align="center" align="center"></el-table-column>
						<!-- <el-table-column prop="score" label="得分" header-align="center" align="center"></el-table-column> -->
						<el-table-column prop="averageScore" label="总分" header-align="center" align="center"></el-table-column>
						<el-table-column prop="recommenderNum" label="引荐" header-align="center" align="center"></el-table-column>
						<el-table-column prop="guestNum" label="嘉宾" header-align="center" align="center"></el-table-column>
						<el-table-column prop="visitNum" label="走访" header-align="center" align="center"></el-table-column>
						<el-table-column prop="attendance" label="出勤" header-align="center" align="center"></el-table-column>
					</el-table>
				</div>
				<div v-if="averageScoreList.length > 5" class="ctrl-btn" @click="averageScoreShowAll = !averageScoreShowAll">
					{{ averageScoreShowAll ? '收起' : '展开全部' }} <el-icon><ArrowUp v-if="averageScoreShowAll" /> <ArrowDown v-else /></el-icon>
				</div>
			</div>
			<div style="margin: 10px; width: 48%">
				<div style="display: flex; align-items: center; margin: 8px">
					<div style="margin-right: 8px">给出引荐数量排行榜</div>
					<el-select v-model="recommenderNumListOption" @change="handleRecommenderNumListOption" style="width: 80px">
						<el-option label="本月" value="1"></el-option>
						<el-option label="本届" value="2"></el-option>
					</el-select>
				</div>
				<div class="fold-table" :style="{ height: recommenderNumShowAll || recommenderNumList.length < 5 ? 'auto' : '200px' }">
					<el-table v-loading="recommenderNumListLoading" :data="recommenderNumList" border>
						<!-- <el-table-column prop="id" label="id" header-align="center" align="center"></el-table-column> -->
						<el-table-column prop="name" label="姓名" header-align="center" align="center"></el-table-column>
						<!-- <el-table-column prop="num" label="引荐数量" header-align="center" align="center"></el-table-column> -->
						<el-table-column prop="totalRecommenderNum" label="总引荐" header-align="center" align="center"></el-table-column>
						<el-table-column prop="innerRecommenderNum" label="内部引荐" header-align="center" align="center"></el-table-column>
						<el-table-column prop="outerRecommenderNum" label="外部引荐" header-align="center" align="center"></el-table-column>
					</el-table>
				</div>
				<div v-if="recommenderNumList.length > 5" class="ctrl-btn" @click="recommenderNumShowAll = !recommenderNumShowAll">
					{{ recommenderNumShowAll ? '收起' : '展开全部' }} <el-icon><ArrowUp v-if="recommenderNumShowAll" /> <ArrowDown v-else /></el-icon>
				</div>
			</div>
		</div>

		<div style="display: flex; justify-content: center">
			<div style="margin: 10px; width: 37%">
				<div style="display: flex; align-items: center; margin: 8px">
					<div style="margin-right: 8px">给出引荐金额排行榜</div>
					<el-select v-model="recommenderMoneyListOption" @change="handleRecommenderMoneyListOption" style="width: 80px">
						<el-option label="本月" value="1"></el-option>
						<el-option label="本届" value="2"></el-option>
					</el-select>
				</div>
				<div class="fold-table" :style="{ height: recommenderMoneyShowAll || recommenderMoneyList.length < 5 ? 'auto' : '200px' }">
					<el-table v-loading="recommenderMoneyListLoading" :data="recommenderMoneyList" border>
						<!-- <el-table-column prop="id" label="id" header-align="center" align="center"></el-table-column> -->
						<el-table-column prop="name" label="姓名" header-align="center" align="center"></el-table-column>
						<el-table-column prop="totalRecommenderMoney" label="总成交金额" header-align="center" align="center"></el-table-column>
						<el-table-column prop="innerRecommenderMoney" label="内部成交金额" header-align="center" align="center"></el-table-column>
						<el-table-column prop="outerRecommenderMoney" label="外部成交金额" header-align="center" align="center"></el-table-column>
					</el-table>
				</div>
				<div v-if="recommenderMoneyList.length > 5" class="ctrl-btn" @click="recommenderMoneyShowAll = !recommenderMoneyShowAll">
					{{ recommenderMoneyShowAll ? '收起' : '展开全部' }} <el-icon><ArrowUp v-if="recommenderMoneyShowAll" /> <ArrowDown v-else /></el-icon>
				</div>
			</div>
			<div style="margin: 10px; width: 20%">
				<div style="display: flex; align-items: center; margin: 8px">
					<div style="margin-right: 8px">邀约嘉宾排行榜</div>
					<el-select v-model="guestNumListOption" @change="handleGuestNumListOption" style="width: 80px">
						<el-option label="本月" value="1"></el-option>
						<el-option label="本届" value="2"></el-option>
					</el-select>
				</div>
				<div class="fold-table" :style="{ height: guestNumShowAll || guestNumList.length < 5 ? 'auto' : '200px' }">
					<el-table v-loading="guestNumListLoading" :data="guestNumList" border>
						<!-- <el-table-column prop="id" label="id" header-align="center" align="center"></el-table-column> -->
						<el-table-column prop="name" label="姓名" header-align="center" align="center"></el-table-column>
						<el-table-column prop="guestNum" label="嘉宾数" header-align="center" align="center"></el-table-column>
					</el-table>
				</div>
				<div v-if="guestNumList.length > 5" class="ctrl-btn" @click="guestNumShowAll = !guestNumShowAll">
					{{ guestNumShowAll ? '收起' : '展开全部' }} <el-icon><ArrowUp v-if="guestNumShowAll" /> <ArrowDown v-else /></el-icon>
				</div>
			</div>
			<div style="margin: 10px; width: 37%">
				<div style="display: flex; align-items: center; margin: 8px">
					<div style="margin-right: 8px">走访数量排行榜</div>
					<el-select v-model="visitNumListOption" @change="handleVisitNumListOption" style="width: 80px">
						<el-option label="本月" value="1"></el-option>
						<el-option label="本届" value="2"></el-option>
					</el-select>
				</div>
				<div class="fold-table" :style="{ height: visitNumShowAll || visitNumList.length < 5 ? 'auto' : '200px' }">
					<el-table v-loading="visitNumListLoading" :data="visitNumList" border>
						<!-- <el-table-column prop="id" label="id" header-align="center" align="center"></el-table-column> -->
						<el-table-column prop="name" label="姓名" header-align="center" align="center"></el-table-column>
						<el-table-column prop="totalVisitNum" label="总走访" header-align="center" align="center"></el-table-column>
						<el-table-column prop="p2pVisitNum" label="点对点走访" header-align="center" align="center"></el-table-column>
						<el-table-column prop="groupVisitNum" label="集体走访" header-align="center" align="center"></el-table-column>
					</el-table>
				</div>
				<div v-if="visitNumList.length > 5" class="ctrl-btn" @click="visitNumShowAll = !visitNumShowAll">
					{{ visitNumShowAll ? '收起' : '展开全部' }} <el-icon><ArrowUp v-if="visitNumShowAll" /> <ArrowDown v-else /></el-icon>
				</div>
			</div>
		</div>

		<div style="display: flex; justify-content: center">
			<div style="margin: 10px; width: 48%">
				<div style="display: flex; align-items: center; margin: 8px">
					<div style="margin-right: 8px">收到引荐数量排行榜</div>
					<el-select v-model="recommandedNumListOption" @change="handleRecommandedNumListOption" style="width: 80px">
						<el-option label="本月" value="1"></el-option>
						<el-option label="本届" value="2"></el-option>
					</el-select>
				</div>
				<div class="fold-table" :style="{ height: recommandedNumShowAll || recommandedNumList.length < 5 ? 'auto' : '200px' }">
					<el-table v-loading="recommandedNumListLoading" :data="recommandedNumList" border>
						<!-- <el-table-column prop="id" label="id" header-align="center" align="center"></el-table-column> -->
						<el-table-column prop="name" label="姓名" header-align="center" align="center"></el-table-column>
						<!-- <el-table-column prop="num" label="收到引荐数量" header-align="center" align="center"></el-table-column> -->
						<el-table-column prop="totalRecommendedNum" label="总引荐" header-align="center" align="center"></el-table-column>
						<el-table-column prop="innerRecommendedNum" label="内部引荐" header-align="center" align="center"></el-table-column>
						<el-table-column prop="outerRecommendedNum" label="外部引荐" header-align="center" align="center"></el-table-column>
					</el-table>
				</div>
				<div v-if="recommandedNumList.length > 5" class="ctrl-btn" @click="recommandedNumShowAll = !recommandedNumShowAll">
					{{ recommandedNumShowAll ? '收起' : '展开全部' }} <el-icon><ArrowUp v-if="recommandedNumShowAll" /> <ArrowDown v-else /></el-icon>
				</div>
			</div>
			<div style="margin: 10px; width: 48%">
				<div style="display: flex; align-items: center; margin: 8px">
					<div style="margin-right: 8px">收到引荐金额排行榜</div>
					<el-select v-model="recommandedMoneyListOption" @change="handleRecommandedMoneyListOption" style="width: 80px">
						<el-option label="本月" value="1"></el-option>
						<el-option label="本届" value="2"></el-option>
					</el-select>
				</div>
				<div class="fold-table" :style="{ height: recommandedMoneyShowAll || recommandedMoneyList.length < 5 ? 'auto' : '200px' }">
					<el-table v-loading="recommandedMoneyListLoading" :data="recommandedMoneyList" border>
						<!-- <el-table-column prop="id" label="id" header-align="center" align="center"></el-table-column> -->
						<el-table-column prop="name" label="姓名" header-align="center" align="center"></el-table-column>
						<!-- <el-table-column prop="money" label="收到引荐金额" header-align="center" align="center"></el-table-column> -->
						<el-table-column prop="totalRecommendedMoney" label="总成交金额" header-align="center" align="center"></el-table-column>
						<el-table-column prop="innerRecommendedMoney" label="内部成交金额" header-align="center" align="center"></el-table-column>
						<el-table-column prop="outerRecommendedMoney" label="外部成交金额" header-align="center" align="center"></el-table-column>
					</el-table>
				</div>
				<div v-if="recommandedMoneyList.length > 5" class="ctrl-btn" @click="recommandedMoneyShowAll = !recommandedMoneyShowAll">
					{{ recommandedMoneyShowAll ? '收起' : '展开全部' }} <el-icon><ArrowUp v-if="recommandedMoneyShowAll" /> <ArrowDown v-else /></el-icon>
				</div>
			</div>
		</div>

		<div style="display: flex; justify-content: center; margin-top: 50px; width: 100%">
			<div ref="recommendNumCharts" style="width: 45%; height: 350px; margin: 8px"></div>
			<div ref="recommendMoneyCharts" style="width: 45%; height: 350px; margin: 8px"></div>
		</div>

		<div style="display: flex; justify-content: center; margin-top: 50px; width: 100%">
			<div ref="visitNumCharts" style="width: 45%; height: 350px; margin: 8px"></div>
			<div ref="attendanceRate" style="width: 45%; height: 350px; margin: 8px"></div>
		</div>

		<div style="display: flex; justify-content: center; margin-top: 50px; width: 100%">
			<div ref="vipNumChart" style="width: 45%; height: 350px; margin: 8px"></div>
			<div ref="guestNumChart" style="width: 45%; height: 350px; margin: 8px"></div>
		</div>
	</el-card>
</template>

<script setup lang="ts" name="ModulePz_dataBoardIndex">
import { onMounted, ref } from 'vue'
import {
	usePz_dataBoardAverageScoreApi,
	usePz_dataBoardGuestNumApi,
	usePz_dataBoardRecommandedMoneyApi,
	usePz_dataBoardRecommandedNumApi,
	usePz_dataBoardRecommanderMoneyApi,
	usePz_dataBoardRecommanderNumApi,
	usePz_dataBoardVisitNumApi,
	usePz_dataBoardRecommanderNumChartApi,
	usePz_dataBoardRecommanderMoneyChartApi,
	usePz_dataBoardVisitNumChartApi,
	usePz_dataBoardVipNumChartApi,
	usePz_dataBoardGuestNumChartApi,
	usePz_dataBoardAttendanceRateApi
} from '@/api/module/pz_dataBoard'
import { ElMessage } from 'element-plus'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import { dayjs } from 'element-plus'
import * as echarts from 'echarts'
import { map } from 'xe-utils'
import { da } from 'element-plus/es/locale'

// echarts绘制数据
// 引荐数量
const recommendNumCharts = ref()
// 引荐金额
const recommendMoneyCharts = ref()
// 走访数量
const visitNumCharts = ref()
// VIP数量
const vipNumChart = ref()
// 嘉宾数量
const guestNumChart = ref()
// 出席率
const attendanceRate = ref()

// 综合得分榜
const arr = new Array(10).fill({
	attendance: 0,
	averageScore: 0,
	guestNum: 0,
	id: 0,
	name: '微信用户',
	recommenderNum: 0,
	visitNum: 0
})
const showAll = ref(false)

const averageScoreList = ref([])
const averageScoreListLoading = ref(false)
const averageScoreShowAll = ref(false)
const averageScoreListTime = ref(dayjs(new Date()).format('YYYY-MM'))
const getAverageScoreList = (time: any) => {
	averageScoreListLoading.value = true
	usePz_dataBoardAverageScoreApi(time)
		.then(res => {
			if (res.code === 0) {
				averageScoreList.value = res.data
			}
			averageScoreListLoading.value = false
		})
		.catch(() => {
			averageScoreListLoading.value = false
		})
}
const handleAverageScoreListTime = () => {
	getAverageScoreList(dayjs(averageScoreListTime.value).format('YYYY-MM-DD'))
}

// 给出引荐排行榜
const recommenderNumList = ref([])
const recommenderNumListLoading = ref(false)
const recommenderNumShowAll = ref(false)
const recommenderNumListOption = ref('1')
const getRecommenderNumList = (type: any) => {
	recommenderNumListLoading.value = true
	usePz_dataBoardRecommanderNumApi(type)
		.then(res => {
			if (res.code === 0) {
				recommenderNumList.value = res.data
			}
			recommenderNumListLoading.value = false
		})
		.catch(() => {
			recommenderNumListLoading.value = false
		})
}
const handleRecommenderNumListOption = () => {
	getRecommenderNumList(recommenderNumListOption.value)
}

// 给出引荐金额排行榜
const recommenderMoneyList = ref([])
const recommenderMoneyListLoading = ref(false)
const recommenderMoneyShowAll = ref(false)
const recommenderMoneyListOption = ref('1')
const getRecommenderMoneyList = (type: any) => {
	recommenderMoneyListLoading.value = true
	usePz_dataBoardRecommanderMoneyApi(type)
		.then(res => {
			if (res.code === 0) {
				recommenderMoneyList.value = res.data
			}
			recommenderMoneyListLoading.value = false
		})
		.catch(() => {
			recommenderMoneyListLoading.value = false
		})
}
const handleRecommenderMoneyListOption = () => {
	getRecommenderMoneyList(recommenderMoneyListOption.value)
}

// 邀约嘉宾排行榜
const guestNumList = ref([])
const guestNumListLoading = ref(false)
const guestNumShowAll = ref(false)
const guestNumListOption = ref('1')
const getGuestNumList = (type: any) => {
	guestNumListLoading.value = true
	usePz_dataBoardGuestNumApi(type)
		.then(res => {
			if (res.code === 0) {
				guestNumList.value = res.data
			}
			guestNumListLoading.value = false
		})
		.catch(() => {
			guestNumListLoading.value = false
		})
}
const handleGuestNumListOption = () => {
	getGuestNumList(guestNumListOption.value)
}

// 走访排行榜
const visitNumList = ref([])
const visitNumListLoading = ref(false)
const visitNumShowAll = ref(false)
const visitNumListOption = ref('1')
const getVisitNumList = (type: any) => {
	visitNumListLoading.value = true
	usePz_dataBoardVisitNumApi(type)
		.then(res => {
			if (res.code === 0) {
				visitNumList.value = res.data
			}
			visitNumListLoading.value = false
		})
		.catch(() => {
			visitNumListLoading.value = false
		})
}
const handleVisitNumListOption = () => {
	getVisitNumList(visitNumListOption.value)
}

// 收到引荐数量排行榜
const recommandedNumList = ref([])
const recommandedNumListLoading = ref(false)
const recommandedNumShowAll = ref(false)
const recommandedNumListOption = ref('1')
const getRecommandedNumList = (type: any) => {
	recommandedNumListLoading.value = true
	usePz_dataBoardRecommandedNumApi(type)
		.then(res => {
			if (res.code === 0) {
				recommandedNumList.value = res.data
			}
			recommandedNumListLoading.value = false
		})
		.catch(() => {
			recommandedNumListLoading.value = false
		})
}
const handleRecommandedNumListOption = () => {
	getRecommandedNumList(recommandedNumListOption.value)
}

// 收到引荐金额排行榜
const recommandedMoneyList = ref([])
const recommandedMoneyListLoading = ref(false)
const recommandedMoneyShowAll = ref(false)
const recommandedMoneyListOption = ref('1')
const getRecommandedMoneyList = (type: any) => {
	recommandedMoneyListLoading.value = true
	usePz_dataBoardRecommandedMoneyApi(type)
		.then(res => {
			if (res.code === 0) {
				recommandedMoneyList.value = res.data
			}
			recommandedMoneyListLoading.value = false
		})
		.catch(() => {
			recommandedMoneyListLoading.value = false
		})
}
const handleRecommandedMoneyListOption = () => {
	getRecommandedMoneyList(recommandedMoneyListOption.value)
}

onMounted(() => {
	getAverageScoreList(dayjs(new Date()).format('YYYY-MM-DD'))
	getRecommenderNumList(recommenderNumListOption.value)
	getRecommenderMoneyList(recommenderMoneyListOption.value)
	getGuestNumList(guestNumListOption.value)
	getVisitNumList(visitNumListOption.value)
	getRecommandedNumList(recommandedNumListOption.value)
	getRecommandedMoneyList(recommandedMoneyListOption.value)
	initCharts()
})

const initCharts = () => {
	// 引荐数量折线图
	const chart1 = echarts.init(recommendNumCharts.value)
	let data1 = null
	const curDate = new Date()
	usePz_dataBoardRecommanderNumChartApi().then(res => {
		if (res.code == 0) {
			data1 = res.data
			chart1.setOption({
				title: {
					text: '引荐数量表'
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross',
						label: {
							backgroundColor: '#6a7985'
						}
					}
				},
				legend: {
					data: ['总引荐', '内部引荐', '外部引荐'],
					left: '20%'
				},
				toolbox: {
					feature: {
						saveAsImage: {}
					}
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: [
					{
						type: 'category',
						boundaryGap: false,
						data: [
							dayjs(curDate).add(-5, 'M').format('YYYY-MM'),
							dayjs(curDate).add(-4, 'M').format('YYYY-MM'),
							dayjs(curDate).add(-3, 'M').format('YYYY-MM'),
							dayjs(curDate).add(-2, 'M').format('YYYY-MM'),
							dayjs(curDate).add(-1, 'M').format('YYYY-MM'),
							dayjs(curDate).format('YYYY-MM')
						]
					}
				],
				yAxis: [
					{
						type: 'value'
					}
				],
				series: [
					{
						name: '总引荐',
						type: 'line',
						emphasis: {
							focus: 'series'
						},
						data: data1.total
					},
					{
						name: '内部引荐',
						type: 'line',
						emphasis: {
							focus: 'series'
						},
						data: data1.inner
					},
					{
						name: '外部引荐',
						type: 'line',
						emphasis: {
							focus: 'series'
						},
						data: data1.outer
					}
				]
			})
		} else {
			ElMessage.error(res.msg)
		}
	})

	const chart2 = echarts.init(recommendMoneyCharts.value)
	let data2 = null
	usePz_dataBoardRecommanderMoneyChartApi().then(res => {
		if (res.code == 0) {
			data2 = res.data
			chart2.setOption({
				title: {
					text: '引荐金额表'
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross',
						label: {
							backgroundColor: '#6a7985'
						}
					}
				},
				legend: {
					data: ['总引荐', '内部引荐', '外部引荐'],
					left: '20%'
				},
				toolbox: {
					feature: {
						saveAsImage: {}
					}
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: [
					{
						type: 'category',
						boundaryGap: false,
						data: [
							dayjs(curDate).add(-5, 'M').format('YYYY-MM'),
							dayjs(curDate).add(-4, 'M').format('YYYY-MM'),
							dayjs(curDate).add(-3, 'M').format('YYYY-MM'),
							dayjs(curDate).add(-2, 'M').format('YYYY-MM'),
							dayjs(curDate).add(-1, 'M').format('YYYY-MM'),
							dayjs(curDate).format('YYYY-MM')
						]
					}
				],
				yAxis: [
					{
						type: 'value'
					}
				],
				series: [
					{
						name: '总引荐',
						type: 'line',
						emphasis: {
							focus: 'series'
						},
						data: data2.total
					},
					{
						name: '内部引荐',
						type: 'line',
						emphasis: {
							focus: 'series'
						},
						data: data2.inner
					},
					{
						name: '外部引荐',
						type: 'line',
						emphasis: {
							focus: 'series'
						},
						data: data2.outer
					}
				]
			})
		}
	})

	const chart3 = echarts.init(visitNumCharts.value)
	let data3 = null
	usePz_dataBoardVisitNumChartApi().then(res => {
		if (res.code == 0) {
			data3 = res.data
			chart3.setOption({
				title: {
					text: '走访数量表'
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross',
						label: {
							backgroundColor: '#6a7985'
						}
					}
				},
				legend: {
					data: ['总走访', '点对点走访', '集体走访'],
					left: '20%'
				},
				toolbox: {
					feature: {
						saveAsImage: {}
					}
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: [
					{
						type: 'category',
						boundaryGap: false,
						data: [
							dayjs(curDate).add(-5, 'M').format('YYYY-MM'),
							dayjs(curDate).add(-4, 'M').format('YYYY-MM'),
							dayjs(curDate).add(-3, 'M').format('YYYY-MM'),
							dayjs(curDate).add(-2, 'M').format('YYYY-MM'),
							dayjs(curDate).add(-1, 'M').format('YYYY-MM'),
							dayjs(curDate).format('YYYY-MM')
						]
					}
				],
				yAxis: [
					{
						type: 'value'
					}
				],
				series: [
					{
						name: '总走访',
						type: 'line',
						emphasis: {
							focus: 'series'
						},
						data: data3.total
					},
					{
						name: '点对点走访',
						type: 'line',
						emphasis: {
							focus: 'series'
						},
						data: data3.p2p
					},
					{
						name: '集体走访',
						type: 'line',
						emphasis: {
							focus: 'series'
						},
						data: data3.group
					}
				]
			})
		}
	})

	const chart4 = echarts.init(vipNumChart.value)
	let data4 = null
	usePz_dataBoardVipNumChartApi().then((res: any) => {
		if (res.code == 0) {
			data4 = res.data
			chart4.setOption({
				title: {
					text: 'vip数量折线图'
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross',
						label: {
							backgroundColor: '#6a7985'
						}
					}
				},
				legend: {
					data: ['新增', '流失'],
					left: '20%'
				},
				toolbox: {
					feature: {
						saveAsImage: {}
					}
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: [
					{
						type: 'category',
						boundaryGap: false,
						data: data4.month
					}
				],
				yAxis: [
					{
						type: 'value'
					}
				],
				series: [
					{
						name: '新增',
						type: 'line',
						emphasis: {
							focus: 'series'
						},
						data: data4.addNum
					},
					{
						name: '流失',
						type: 'line',
						emphasis: {
							focus: 'series'
						},
						data: data4.reduceNum
					}
				]
			})
		}
	})

	const chart5 = echarts.init(guestNumChart.value)
	let data5 = null
	usePz_dataBoardGuestNumChartApi().then((res: any) => {
		if (res.code == 0) {
			data5 = res.data
			chart5.setOption({
				title: {
					text: '嘉宾数量折线图'
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross',
						label: {
							backgroundColor: '#6a7985'
						}
					}
				},
				legend: {
					data: ['新增'],
					left: '20%'
				},
				toolbox: {
					feature: {
						saveAsImage: {}
					}
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: [
					{
						type: 'category',
						boundaryGap: false,
						data: data5.month
					}
				],
				yAxis: [
					{
						type: 'value'
					}
				],
				series: [
					{
						name: '新增',
						type: 'line',
						emphasis: {
							focus: 'series'
						},
						data: data5.addNum
					}
				]
			})
		}
	})

	const chart6 = echarts.init(attendanceRate.value)
	let data6 = null
	usePz_dataBoardAttendanceRateApi().then((res: any) => {
		if (res.code == 0) {
			data6 = res.data
			chart6.setOption({
				title: {
					text: '出席率'
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross',
						label: {
							backgroundColor: '#6a7985'
						}
					},
					formatter: function (params) {
						let result = ''
						params.forEach(function (item) {
							result += item.seriesName + ' : ' + item.value + '%<br/>'
						})
						return result
					}
				},
				legend: {
					data: ['出席率'],
					left: '20%'
				},
				toolbox: {
					feature: {
						saveAsImage: {}
					}
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: [
					{
						type: 'category',
						boundaryGap: false,
						data: data6.month
					}
				],
				yAxis: [
					{
						type: 'value'
					}
				],
				series: [
					{
						name: '比例',
						type: 'line',
						emphasis: {
							focus: 'series'
						},
						data: data6.rate,
						formatter: '{value}%'
					}
				]
			})
		}
	})
}
</script>

<style lang="scss">
.fold-table {
	overflow: hidden;
}
.ctrl-btn {
	text-align: center;
	line-height: 30px;
	color: #999;
}
</style>
