import service from "@/utils/request";

// 综合得分
export const usePz_dataBoardAverageScoreApi = (time: any) => {
    return service.get("/module/pz_dataBoard/averageScore/" + time);
}

// 给出引荐数量
export const usePz_dataBoardRecommanderNumApi = (type: any) => {
    return service.get("/module/pz_dataBoard/recommenderNum/" + type);
}

// 给出引荐金额
export const usePz_dataBoardRecommanderMoneyApi = (type: any) => {
    return service.get("/module/pz_dataBoard/recommenderMoney/" + type);
}

// 邀约嘉宾数量
export const usePz_dataBoardGuestNumApi = (type: any) => {
    return service.get("/module/pz_dataBoard/guestNum/" + type);
}

// 走访数量
export const usePz_dataBoardVisitNumApi = (type: any) => {
    return service.get("/module/pz_dataBoard/visitNum/" + type);
}

// 收到引荐数量
export const usePz_dataBoardRecommandedNumApi = (type: any) => {
    return service.get("/module/pz_dataBoard/recommendedNum/" + type);
}

// 收到引荐金额
export const usePz_dataBoardRecommandedMoneyApi = (type: any) => {
    return service.get("/module/pz_dataBoard/recommendedMoney/" + type);
}

// 引荐数量图表
export const usePz_dataBoardRecommanderNumChartApi = () => {
    return service.get("/module/pz_dataBoard/recommenderNumChart");
}

// 引荐金额图表
export const usePz_dataBoardRecommanderMoneyChartApi = () => {
    return service.get("/module/pz_dataBoard/recommenderMoneyChart");
}

// 走访数量图表
export const usePz_dataBoardVisitNumChartApi = () => {
    return service.get("/module/pz_dataBoard/visitNumChart");
}


// VIP数量图
export const usePz_dataBoardVipNumChartApi = () => {
    return service.get("/module/pz_dataBoard/vipNumChart");
}

// 嘉宾数量折线图
export const usePz_dataBoardGuestNumChartApi = () => {
    return service.get("/module/pz_dataBoard/guestNumChart");
}

// 出席率
export const usePz_dataBoardAttendanceRateApi = () => {
    return service.get("/module/pz_dataBoard/attendanceRate");
}
