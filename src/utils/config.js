export const apiUrl = 'http://192.168.100.130/server/modules/'
export const apiUploadUrl = `${apiUrl}module/imgUpload`
export const dateFormat = {
  date: 'YYYY-MM-DD',
  minute: 'YYYY-MM-DD HH:mm',
  datetime: 'YYYY-MM-DD HH:mm:ss'
}
// 学员状态
export const studentStatus = [
  {
    name: '待审核',
    value: 1
  },
  {
    name: '待交费',
    value: 2
  },
  {
    name: '已交费',
    value: 3
  },
  {
    name: '未通过',
    value: 4
  }

]
