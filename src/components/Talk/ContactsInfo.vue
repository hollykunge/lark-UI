<template>
  <!-- contacts info component -->
  <div class="contacts-info">

    <!-- 加载中状态 -->
    <a-spin :spinning="loadingState" :delay="200" tip="加载中···" class="loading-tip">
    </a-spin>

    <div v-if="!selected" class="unselected-tip">
      <a-icon type="user" style="fontSize: 160px; color: #d7d9db" />
      <p>未选择联系人</p>
    </div>

    <!-- 重新加载 -->
    <div v-if="!Object.keys(contactsInfo).length && !loadingState && selected.length" class="reload-tip">
      <a-icon type="frown" style="fontSize: 140px; color: #d7d9db" />
      <p>加载失败，
        <a-button type="danger" ghost size="small" @click="getData(selected)">重新加载</a-button>
      </p>
    </div>

    <div v-if="Object.keys(contactsInfo).length && !loadingState && selected.length" class="selected-info">
      <div class="info-wrapper">
        <div class="name-and-org">
          <p>{{ contactsInfo.name }}</p>
          <p>{{ contactsInfo.remark }}</p>
        </div>

        <a-avatar class="avatar-img" shape="square" :src="contactsInfo.avatar" :size="75">
          {{ contactsInfo.name }}
        </a-avatar>

      </div>

      <div class="info-wrapper">
        <div class="info-list">
          <div>
            <p class="attr">密级:</p>
            <p class="val">{{ contactsInfo.secretLevel | peopleSecret }}</p>
          </div>
          <div>
            <p class="attr">单位:</p>
            <p class="val">{{ contactsInfo.orgName }}</p>
          </div>
          <div>
            <p class="attr">电话:</p>
            <p class="val">{{ contactsInfo.otel }}</p>
          </div>
          <div>
            <p class="attr">邮箱:</p>
            <p class="val">{{ contactsInfo.oemail }}</p>
          </div>
        </div>
      </div>

      <a-button type="primary" class="send-msg-btn" @click="sendMessage">发消息</a-button>
    </div>

  </div>
</template>

<script>
import { getContactsInfo } from '@/api/talk'

export default {
  name: 'ContactsInfo',
  props: {
    // the selected contact
    selected: {
      type: String,
      default: '',
      required: true
    }
  },
  data () {
    return {
      /** 联系人信息 */
      contactsInfo: {},
      /** 加载状态 */
      loadingState: false
    }
  },
  watch: {
    selected: function (newValue) {
      if (newValue) {
        this.getData(newValue)
      }
    }
  },
  methods: {
    /** 通过id获取联系人信息 */
    getData (contactsId) {
      [ this.contactsInfo, this.loadingState ] = [ {}, true ]

      getContactsInfo(contactsId).then(res => {
        if (res.status === 200) {
          this.contactsInfo = res.result
        }

        this.loadingState = false
      }, () => {
        this.loadingState = false
      })
    },
    /** 跳转到研讨页 */
    sendMessage () {
      this.$emit('clickSend')
      const contactItem = this.contactsInfo
      this.$router.push({ name: 'ChatBox' })
      contactItem.reOrder = true
      contactItem.addUnread = false
      this.$store.dispatch('UpdateRecentContacts', contactItem)
        .then(() => {
          this.$store.commit('SET_CURRENT_TALK', contactItem.id)
        })
    }
  }
}
</script>

<style lang="less" scoped>
  .contacts-info {
    height: 100%;
    text-align: center;
  }

  .loading-tip {
    position: absolute;
    margin-top: 20%;
    z-index: 100;
  }

  .unselected-tip {
    padding-top: 20%;
    color: #a5a7a9;
    font-size: 16px;
  }

  .reload-tip {
    padding-top: 20%;
    color: #a5a7a9;
    font-size: 16px;
  }

  .selected-info {
    height: 100%;
    padding-top: 15%;

    .info-wrapper {
      margin: 0 auto;
      width: 450px;
      position: relative;
      border-bottom: 1px solid #dadcdf;

      .name-and-org  {
        height: 105px;
        line-height: 35px;
        text-align: left;
        margin-right: 80px;

        p {
          margin: 0;
          overflow: hidden;

          &:first-child {
            font-size: 22px;
            font-weight: 400;
            color: black;
            word-wrap: normal;
            white-space: nowrap;
            text-overflow: ellipsis;

          }

          &:nth-child(2) {
            font-size: 12px;
            color: rgb(140, 141, 143);
            line-height: 20px;
          }
        }

      }

      .avatar-img {
        position: absolute;
        right: 0;
        top: 0;
        border-radius: 2px;
        background-color: #4da6fa;

        span {
          color: #fff;
        }
      }

      .info-list {
        padding: 40px 0 30px 0;
        text-align: left;
        div {
          display: flex;
          .attr {
            width: 80px;
            min-width: 80px;
            color: rgba(153, 153, 153, 1);
          }
          .val {
            color: black;
          }
        }
      }
    }

    .send-msg-btn {
      margin-top: 40px;
      padding: 10px 28px 28px 28px;
    }
  }
</style>
