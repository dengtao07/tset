

<!------------------------------------------------- 此 vue 界面未用到 ---------------------------------------------->
<template>
  <div>
    <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
    <span>招商银行重庆分行--欢迎页面</span>
  </div>
</template>

<script>
import { getUrlKey } from '../plugins/urlGet'
import { setToken } from "../util/app";

export default {
  name: 'Login',
  mounted: function () {
    this.getInfo()
  },
  data () {
    return {
      data: '',
      token: ''
      //朱梨
      // data: 'eyJ5c3RJRCI6IjI3ODU4OSIsImludXNlSUQiOiIyNzg1ODkiLCJvcmdJRCI6IjEyMjkwNCIsInRpbWUiOiIyMDIwLTA3LTAzVDE0OjIwOjQ4IiwiaXAiOiI5OS4xNzAuMjYuMjUiLCJzYXBJRCI6IjAxMTc1OTc2IiwiZW1haWwiOiJ6aHV6aHVsaWxpQGNtYmNoaW5hLmNvbSIsIm5hbWUiOiLmnLHmoqgiLCJicjEiOjEwMTUxMywicGF0aE5hbWUiOiLph43luobliIbooYwv5L+h5oGv5oqA5pyv6YOoL+aVsOaNruWIhuaekOW6lOeUqOWupCIsImdwSUQiOiIwMjAyMzQ1MTYwIiwic3lzSUQiOjE2ODksIm9zVmVyc2lvbiI6IiIsInB1YlZlcnNpb24iOiIiLCJwbGF0Zm9ybSI6InBjIiwicGF0aElEIjoiMTAxNTEzLzEwMTU4OC8xMjI5MDQiLCJkZXZpY2VJRCI6IiIsIm9yZ05hbWUiOiLmlbDmja7liIbmnpDlupTnlKjlrqQiLCJnZW5kZXIiOiJNIiwib3BlbklEIjoiNDcxODZBRDc3NDk0NDBFMjNERTJFRkQ5ODNEMkYzNTAifQ==',
      // token: '2b43dff8125e1346a7981a8fdcd2a68357c0e5720511dd9c96bad893df5daf9c07d56f9a692bc0c13f9471b52dd144ee1ea90fb9607fdab0cf50a2d1a1a58b42',
    }
  },
  methods: {
    getInfo () {
      this.data = getUrlKey('Data');
      //console.log(this.data)
      this.token = getUrlKey('Token');
      debugger;
      this.verify();
    },
    verify () {
      let ob = { data: '', sign: '' };
      ob.data = this.data;
      ob.sign = this.token;
      debugger;
      this.Csp()
      // this.$http({
      //   url: '/Login/verify',
      //   method: 'POST',
      //   data: ob
      // })
      //   .then(res => {
      //     if (res.data.errCode === 100 && res.data.msg === '验签成功') {
      //       this.Csp()
      //     } else {
      //       alert('验证未通过，请重新登陆')
      //     }
      //   })
      //   .catch(function (error) {
      //     console.log(error)
      //   })
    },
    Csp () {
      debugger;
      this.toOrdinary()
      // this.$http({
      //   url: '/Csp/getUser',
      //   method: 'POST',
      //   params: {
      //     userData: 'eyJkZXZpY2VJRCI6IkIyMzdGNkU5LUQxNDktNEM4RS1BNjc5LTAzQzRCQzEzMjQyRCIsIm5hbWUiOiLmrrXpu47lipsiLCJvcmdJRCI6IjEwMTU4OSIsIm9yZ05hbWUiOiLova/ku7blvIDlj5HlrqQiLCJvc1ZlcnNpb24iOiI2LjAiLCJwYXRoSUQiOiIvMTAxNTEzLzEwMTU4OC8xMDE1ODkiLCJwYXRoTmFtZSI6IumHjeW6huWIhuihjC/kv6Hmga/mioDmnK/pg6gv6L2v5Lu25byA5Y+R5a6kIiwicGxhdGZvcm0iOiJhbnBob25lIiwicHViVmVyc2lvbiI6IjIwMTcwMzA5MDkiLCJzYXBJRCI6IjAxMDUzOTgxIiwidGltZSI6IjIwMTctMDMtMTNUMTY6NDc6MDgiLCJ5c3RJRCI6IjIwMTUwMCJ9'
      //     // userData: this.data
      //   }
      // })
      //   .then(res => {
      //     //console.log(res.data);
      //     sessionStorage.setItem("ystId", res.data.ystId);//一事通
      //     sessionStorage.setItem("userName", res.data.userName);//姓名
      //     sessionStorage.setItem("mark", res.data.mark);//角色

      //     setToken(this.token);//将token存入cookie
      //     //http://99.170.26.25:8081/login?Data=eyJ5c3RJRCI6IjI3ODU4OSIsImludXNlSUQiOiIyNzg1ODkiLCJvcmdJRCI6IjEyMjkwNCIsInRpbWUiOiIyMDIwLTA2LTIyVDA5OjA1OjMwIiwiaXAiOiI5OS4xNzAuMjYuMjUiLCJzYXBJRCI6IjAxMTc1OTc2IiwiZW1haWwiOiJ6aHV6aHVsaWxpQGNtYmNoaW5hLmNvbSIsIm5hbWUiOiLmnLHmoqgiLCJicjEiOjEwMTUxMywicGF0aE5hbWUiOiLph43luobliIbooYwv5L%2Bh5oGv5oqA5pyv6YOoL%2BaVsOaNruWIhuaekOW6lOeUqOWupCIsImdwSUQiOiIwMjAyMzQ1MTYwIiwic3lzSUQiOjE2ODksIm9zVmVyc2lvbiI6IiIsInB1YlZlcnNpb24iOiIiLCJwbGF0Zm9ybSI6InBjIiwicGF0aElEIjoiMTAxNTEzLzEwMTU4OC8xMjI5MDQiLCJkZXZpY2VJRCI6IiIsIm9yZ05hbWUiOiLmlbDmja7liIbmnpDlupTnlKjlrqQiLCJnZW5kZXIiOiJNIiwib3BlbklEIjoiNDcxODZBRDc3NDk0NDBFMjNERTJFRkQ5ODNEMkYzNTAifQ%3D%3D&Token=2c1d170c5113f9d7b7d6cdef918a6c524795cf0c457bd55720a126e1e82a55d097c4834bd93893885bde2da1cec68e6d96c9e055a048b19756552666cabf9cee&SysID=1689&NextAction=
      //     if (res.data.mark === 'AUD_REC' || res.data.mark === 'AUD_MAG' || res.data.mark === 'AUD_ERS') { this.toOrdinary() } else { this.toNoPermit() }
      //   })
      //   .catch(function (error) {
      //     console.log(error)
      //   })
    },
    toNoPermit () {
      this.$router.push('/nopermit')
    },
    toOrdinary () {
      debugger
      this.$router.push('/ordinary')
    }
  }
}
</script>

<style>
</style>
