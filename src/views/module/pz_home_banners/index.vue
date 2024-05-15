<template>
    <el-card>
        <div style="display: flex; padding-bottom: 50px;">
            <div style="width: 150px;">
                首页轮播图更换
            </div>
            <div v-for="banner in bannersList" :key="banner" style="padding-left: 30px;">
                <el-image :src="banner.content" style="width: 100px; height: 100px;" fit="cover"
                    @click="bannerAddOrUpdateHandle(banner.id)" />
            </div>
            <div style="display: flex; align-items: center; padding-left: 30px;">
                <el-button type="primary" @click="bannerAddOrUpdateHandle()">新增</el-button>
            </div>
        </div>

        <div style="display: flex; padding-bottom: 50px;">
            <div style="width: 150px;">
                首页广告图更换
            </div>
            <div v-for="ad in adList" :key="ad" style="padding-left: 30px;">
                <el-image :src="ad.content" style="width: 100px; height: 100px;" fit="cover"
                    @click="adAddOrUpateHandle(ad.id)" />
            </div>
            <div style="display: flex; align-items: center; padding-left: 30px;">
                <el-button type="primary" @click="adAddOrUpateHandle()">新增</el-button>
            </div>
        </div>

        <div style="display: flex; padding-bottom: 50px;">
            <div style="width: 150px;">
                关于我们
            </div>
            <div>
                <el-input :rows="5" resize="none" type="textarea" v-model="aboutUs" style="width: 500px;" />
            </div>
            <div style="display: flex; align-items: end; padding-left: 30px;">
                <el-button type="primary" @click="aboutUsUpdateHandle()">保存</el-button>
            </div>
        </div>

        <div style="display: flex; padding-bottom: 50px;">
            <div style="width: 150px;">
                了解更多
            </div>
            <div style="display: flex; width: 700px;">
                <WangEditor v-model="more" placeholder="请输入..." mode="simple"></WangEditor>
            </div>
            <div style="display: flex; align-items: end; padding-left: 30px;">
                <el-button type="primary" @click="moreUpdateHandle()">保存</el-button>
            </div>
        </div>
        <bannerAddOrUpdate ref="bannerAddOrUpdateRef" @refreshDataList="getBannersList"></bannerAddOrUpdate>
        <adAddOrUpdat ref="adAddOrUpdatRef" @refreshDataList="getAdList"></adAddOrUpdat>
    </el-card>
</template>

<script setup lang="ts" name="ModulePz_home_bannersIndex">
import { onMounted, ref } from 'vue'
import { ElMessage, UploadInstance, UploadProps, UploadRawFile, genFileId } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import {
    usePz_home_bannersBannerListApi, usePz_home_bannersAdListApi, usePz_home_bannersAboutUsShowApi
    , usePz_home_bannersMoreShowApi, usePz_home_bannersAboutUsUpateApi, usePz_home_bannersMoreUpateApi
} from '@/api/module/pz_home_banners'
import bannerAddOrUpdate from './banner-add-or-update.vue';
import adAddOrUpdat from './ad-add-or-update.vue';
import WangEditor from '@/components/wang-editor/index.vue'


// // 设置请求头
// const headers = {
// 	'Content-Type': 'multipart/form-data'
// }
// // 图像回显到前端
// const imageUrl = ref('')
// // 图像文件
// const fileUpload = ref()
// // 图像文件更换
// const handleChange = (file: any) => {
// 	fileUpload.value = file
// 	imageUrl.value = URL.createObjectURL(file.raw!)
// }
// const upload = ref<UploadInstance>()
// // 图片覆盖上一张图片
// const handleExceed: UploadProps['onExceed'] = files => {
// 	upload.value!.clearFiles()
// 	const file = files[0] as UploadRawFile
// 	file.uid = genFileId()
// 	upload.value!.handleStart(file)
// }
// // 上传图片前的校验
// const beforeAvatarUpload: UploadProps['beforeUpload'] = rawFile => {
// 	if (rawFile.type !== 'image/jpeg') {
// 		ElMessage.error('Avatar picture must be JPG format!')
// 		return false
// 	} else if (rawFile.size / 1024 / 1024 > 2) {
// 		ElMessage.error('Avatar picture size can not exceed 2MB!')
// 		return false
// 	}
// 	return true
// }
// // 上传图片
// const handleImageUpload = () => {
// 	if (!imageUrl.value) {
// 		ElMessage.error('请先上传图片')
// 		return
// 	} else {
// 		let param = new FormData()
// 		if (fileUpload.value == null) {
// 			let emptyBlob = new Blob([''], { type: 'application/octet-stream' })
// 			param.append('file', emptyBlob)
// 		} else {
// 			param.append('file', fileUpload.value.raw)
// 		}

// 		let jsonStr = JSON.stringify({
// 			target: 'home',
// 			sort: 1
// 		})
// 		const blob = new Blob([jsonStr], { type: 'application/json' })
// 		param.append('vo', blob)

//         console.log(param.get('file'))
//         console.log(param.get('vo'))

// 		usePz_home_bannersBannerAddApi(param).then(res => {
// 			if (res.code == 0) {
// 				ElMessage.success('上传成功')
// 			} else {
// 				ElMessage.error('上传失败')
// 			}
// 		})
// 	}
// }



// 获取轮播图列表


const bannersList = ref([])
const getBannersList = () => {
    usePz_home_bannersBannerListApi().then(res => {
        if (res.code == 0) {
            bannersList.value = res.data
        }
    })
}
// 获取广告图列表
const adList = ref([])
const getAdList = () => {
    usePz_home_bannersAdListApi().then(res => {
        if (res.code == 0) {
            adList.value = res.data
        }
    })
}
// 获取“关于我们”文本
const aboutUs = ref('<p>pinzhi</p>')
const getAboutUs = () => {
    usePz_home_bannersAboutUsShowApi().then(res => {
        if (res.code == 0) {
            aboutUs.value = res.data
        }
    })
}

const aboutUsUpdateHandle = () => {
    usePz_home_bannersAboutUsUpateApi(aboutUs.value).then(res => {
        if (res.code == 0) {
            ElMessage.success('保存成功')
        } else {
            ElMessage.error('保存失败')
        }
        getAboutUs()
    })
}

// 获取“更多”文本
const more = ref('')
const getMore = () => {
    usePz_home_bannersMoreShowApi().then(res => {
        if (res.code == 0) {
            more.value = res.data
            console.log(more.value)
        }
    })
}

const moreUpdateHandle = () => {
    let param = new FormData()
    param.append('content', more.value)
    usePz_home_bannersMoreUpateApi(param).then(res => {
        if (res.code == 0) {
            ElMessage.success('保存成功')
        } else {
            ElMessage.error('保存失败')
        }
        getMore()
    })
}

onMounted(() => {
    getBannersList()
    getAdList()
    getAboutUs()
    getMore()
})


const bannerAddOrUpdateRef = ref()
const bannerAddOrUpdateHandle = (id?: number) => {
    bannerAddOrUpdateRef.value.init(id)
}

const adAddOrUpdatRef = ref()
const adAddOrUpateHandle = (id?: number) => {
    adAddOrUpdatRef.value.init(id)
}

</script>

<style scoped>
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>
