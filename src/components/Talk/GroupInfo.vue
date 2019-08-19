<template>
  <!-- group info component -->
  <div class="group-info">
    <!-- 加载中状态 -->
    <a-spin :spinning="loadingState" :delay="200" tip="加载中···" class="loading-tip"></a-spin>

    <div v-show="!selected.length" class="unselected-tip">
      <a-icon type="team" style="fontSize: 160px; color: #d7d9db"/>
      <p>未选择群组</p>
    </div>

    <!-- 重新加载 -->
    <div
      v-show="!Object.keys(groupInfo).length && !loadingState && selected.length"
      class="reload-tip"
    >
      <a-icon type="frown" style="fontSize: 140px; color: #d7d9db"/>
      <p>
        加载失败，
        <a-button type="danger" ghost size="small" @click="getData(selected)">重新加载</a-button>
      </p>
    </div>

    <div v-if="Object.keys(groupInfo).length && !loadingState" class="selected-info">
      <div class="info-wrapper">
        <div class="name-and-org">
          <p>{{ groupInfo.name }}</p>
          <p>{{ groupInfo.description }}</p>
        </div>

        <a-avatar class="avatar-img" shape="square" :src="groupInfo.avatar" :size="75">
          {{ groupInfo.name.substr(0, 6) }}
        </a-avatar>
      </div>

      <div class="info-wrapper">
        <div class="info-list">
          <div>
            <p class="attr">密级</p>
            <p class="val">{{ groupInfo.securityClass | fileSecret }}</p>
          </div>
          <div>
            <p class="attr">主题</p>
            <p class="val">{{ groupInfo.subject }}</p>
          </div>
          <div>
            <p class="attr">创建人</p>
            <p class="val">{{ groupInfo.creatorName }}</p>
          </div>
          <div>
            <p class="attr">创建时间</p>
            <p class="val">{{ groupInfo.createTime }}</p>
          </div>
        </div>
      </div>

      <a-button class="send-msg-btn" type="primary" @click="sendMessage">发消息</a-button>
    </div>
  </div>
</template>

<script>
import { getGroupInfo } from '@/api/talk'

export default {
  name: 'GroupInfo',
  props: {
    // the selected group
    selected: {
      type: String,
      default: '',
      required: true
    }
  },
  data () {
    return {
      /** 群组信息 */
      groupInfo: {},
      /** 加载状态 */
      loadingState: false
    }
  },
  created () {},
  watch: {
    selected: function (newValue) {
      this.getData(newValue)
    }
  },
  methods: {
    /** 通过id获取联系人信息 */
    getData (groupId) {
      [this.groupInfo, this.loadingState] = [{}, true]
      getGroupInfo(groupId).then(
        res => {
          if (res.status === 200) {
            this.groupInfo = res.result
          }

          this.loadingState = false
        },
        () => {
          this.loadingState = false
        }
      )
    },
    /** 跳转到研讨页 */
    sendMessage () {
      this.$emit('clickSend')
      const { id, name, avatar, securityClass, memberNum } = this.groupInfo
      const groupItem = {
        id,
        name,
        avatar,
        memberNum,
        secretLevel: JSON.parse(securityClass),
        isGroup: true,
        reOrder: true,
        addUnread: false
      }
      this.$router.push({ name: 'ChatBox' })
      this.$store.dispatch('UpdateRecentContacts', groupItem)
        .then(() => {
          this.$store.commit('SET_CURRENT_TALK', id)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.group-info {
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

    .name-and-org {
      height: 105px;
      line-height: 35px;
      text-align: left;
      margin-right: 88px;

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
          font-size: 13px;
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
          color: rgb(0, 0, 0);
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
