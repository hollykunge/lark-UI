<template>
  <!-- 聊天消息框 -->
  <div :class="['message-piece', {send: isMe(), receive: !isMe()}]" :key="messageInfo.id">
    <!-- 消息时间 需要判断显示时间的条件 -->
    <div class="time-stamp">
      <div>{{ messageInfo.time | timeFormat }}</div>
    </div>

    <!-- 用户头像 需要添加点击事件，显示用户信息 -->
    <a-avatar
      :class="['message-avatar', {send: isMe(), receive: !isMe()}]"
      shape="square"
      :src="isMe() ? avatar : messageInfo.avatar"
      :size="40"
    >
      {{ messageInfo.username.substr(0, 4) }}
    </a-avatar>

    <div :class="['message-content', {'show-status': isMe()}]">
      <!-- 显示发送人 -->
      <div v-if="!isMe() && messageInfo.isGroup" class="message-nickname">
        <span>{{ messageInfo.username }}</span>
      </div>
      <!-- 显示消息状态 -->
      <div v-if="isMe()" class="message-status">
        <!-- 发送成功 100 -->
        <span v-if="messageStatus === 100" class="send-success">已送达</span>
        <!-- 发送失败 101 -->
        <a-icon v-if="messageStatus === 101" class="send-fail" type="exclamation-circle" />
        <!-- 正在发送 102 -->
        <a-icon v-if="messageStatus === 102" class="sending" type="loading" />
      </div>

      <div class="message-bubble left right">
        <div class="bubble-content" v-contextmenu:messageCM>
          <div class="plain">
            <!-- 纯文本信息 -->
            <div v-if="messageInfo.content.type === 1" class="text-message">
              <div class="secret-tip">
                <span
                  :class="'s-' + messageInfo.content.secretLevel"
                >【{{ JSON.parse(messageInfo.content.secretLevel) | fileSecret }}】</span>
              </div>
              <div v-html="faceTransform(messageInfo.content.title)" class="text-content"></div>
            </div>

            <!-- 图片消息 -->
            <div v-if="messageInfo.content.type === 2" class="img-message">
              <a-spin :spinning="imgLoading === 1" size="small">
                <img
                  @load="handleImg"
                  @error="handleImg"
                  @click="handlePreview('open')"
                  :src="imgPreviewUrl"
                  :alt="fileTitle"
                />
                <a-button
                  v-if="imgLoading === 3"
                  @click="handleImg"
                  style="float: right; margin: 0 10px"
                  type="primary"
                  size="small"
                  icon="redo"
                />

                <div class="img-message-option">
                  <div class="secret-tip">
                    <span
                      :class="'s-' + messageInfo.content.secretLevel"
                    >【{{ JSON.parse(messageInfo.content.secretLevel) | fileSecret }}】</span>
                  </div>
                  <a
                    v-show="messageStatus === 100"
                    :href="downloadUrl"
                    class="download"
                    download
                  >下载</a>
                </div>
              </a-spin>

              <a-modal
                :visible="previewVisible"
                :closable="false"
                :footer="null"
                @cancel="handlePreview('close')"
              >
                <img :alt="messageInfo.content.title" style="width: 100%" :src="downloadUrl" />
              </a-modal>
            </div>

            <!-- 文件消息 -->
            <div v-if="messageInfo.content.type === 3" class="file-message">
              <div class="file-message-icon">
                <a-icon type="file" theme="twoTone" style="fontSize: 26px" />
              </div>
              <div class="file-message-info">
                <a-tooltip placement="topLeft" :title="fileTitle">
                  <span>{{ fileTitle }}</span>
                </a-tooltip>

                <div class="file-option">
                  <div class="secret-tip">
                    <span
                      :class="'s-' + messageInfo.content.secretLevel"
                    >【{{ JSON.parse(messageInfo.content.secretLevel) | fileSecret }}】</span>
                  </div>
                  <a
                    v-show="messageStatus === 100"
                    class="download"
                    @click="handleFileDownload(messageInfo.content.id)"
                  >下载</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 消息气泡右键菜单 -->
    <v-contextmenu ref="messageCM">
      <v-contextmenu-item @click="handleMsgCopy">复制</v-contextmenu-item>
    </v-contextmenu>
  </div>
</template>

<script>
import { toWeiXinString, download } from '@/utils/util'
// eslint-disable-next-line
import api from '@/api/talk'
// eslint-disable-next-line
import { getFilePermission } from '@/api/talk'
import { mapGetters } from 'vuex'
import { transform } from '@/utils/face'

export default {
  name: 'MessagePiece',
  props: {
    /** 消息对象Tweet */
    messageInfo: {
      type: Object,
      default: () => ({}),
      required: true
    },
    /** 是否为群组消息 */
    isGroup: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data () {
    return {
      // 图片加载状态 0:无状态 1:加载中 2:加载成功 3:加载失败
      imgLoading: 0,
      previewVisible: false
    }
  },
  computed: {
    ...mapGetters(['avatar', 'userId']),
    imgPreviewUrl: {
      get: function () {
        return api.imgPrevie + '?fileId=' + this.messageInfo.content.id
      },
      set: function () {}
    },
    downloadUrl () {
      return api.fileDownload + '?fileId=' + this.messageInfo.content.id
    },
    fileTitle () {
      const { secretLevel, extension, title } = this.messageInfo.content
      const ext = extension === '0' || extension === '' ? '' : '.' + extension
      const sec = this.$options.filters.fileSecret(secretLevel)
      return '[' + sec + ']' + title + ext
    },
    messageStatus () {
      return this.$store.getters.getMessageStatus(this.messageInfo.id)
    }
  },
  watch: {
    messageInfo: {
      handler: function () {
        // 处理图片的加载状态
        if (this.messageInfo.content.type === 2) this.imgLoading = 1
        else this.imgLoading = 0
      },
      immediate: true,
      deep: true
    }
  },
  filters: { timeFormat: toWeiXinString, transform: transform },
  methods: {
    /**
     * 判断是否当前用户发送的消息
     * @param {String} fromId 消息发送者的id
     */
    isMe () {
      return this.messageInfo.fromId === this.userId
    },
    /**
     * 图片加载过程处理
     */
    handleImg (event) {
      if (event.type === 'load') {
        this.imgLoading = 2
        this.$emit('imgLoaded', event.target.height)
      }
      if (event.type === 'error') {
        this.imgLoading = 3
      }
      if (event.type === 'click') {
        this.messageInfo.content.id += '&t=' + Math.random()
      }
    },
    /**
     * 图片预览
     */
    handlePreview (option) {
      if (option === 'open' && this.imgLoading === 2) {
        this.previewVisible = true
      } else {
        this.previewVisible = false
      }
    },
    faceTransform (content) {
      return transform(content)
    },
    /**
     * 文件下载
     * @param {String} fileId 文件ID
     */
    handleFileDownload (fileId) {
      getFilePermission(fileId).then(res => {
        if (res.status === 200 && res.result === '1') {
          download(this.downloadUrl, this.fileTitle)
        } else {
          this.$message.warning('未通过审批，不能下载')
        }
      }).catch(() => {
        this.$message.error('下载失败，请稍后再试')
      })
    },
    /**
     * 右键菜单-复制
     */
    handleMsgCopy (vm, event) {
      // 使用vue-clipboard2插件
      this.$copyText(this.messageInfo.content.title)
        .then(e => {
          this.$message.success('复制成功！')
        }, () => {
          this.$message.success('复制失败！')
        })
    }
  }
}
</script>

<style lang="less" scoped>
// 接收到的消息样式
.receive {
  float: left;

  .left {
    &::after,
    &::before {
      right: 100%;
      border-right-color: #fff !important;
      border-right-width: 4px;
    }
  }
}

// 发送的消息样式
.send {
  float: right;
  text-align: right;

  .right {
    background-color: #cce4fc !important;
    &::before,
    &::after {
      left: 100%;
      border-left-color: #cce4fc !important;
      border-left-width: 4px;
    }
  }
}
// 下载键样式
.download {
  cursor: pointer;
  &:hover {
    color: #295786;
  }
}
// 密级标识样式
.secret-tip {
  display: inline;
}

.message-piece {
  width: 100%;
  margin-bottom: 15px;
  display: block;

  .time-stamp {
    text-align: center;
    margin: 10px auto;
    max-width: 50%;

    div {
      display: inline-block;
      font-size: 12px;
      color: #b2b2b2;
      padding: 1px 18px;
    }
  }

  .message-avatar {
    background-color: #4da6fa;
    border-radius: 2px;
    cursor: pointer;
  }

  // 展示消息状态
  .show-status {
    display: flex;
  }
  .message-content {
    overflow: hidden;

    .message-status {
      margin-left: auto;
      // 实现垂直居中
      display: flex;
      align-items: center;
      .send-success {
        color: #d3d6dc;
        font-size: 10px;
      }
      .sending {
        color: #1890ff;
        font-size: 10px;
      }
      .send-fail {
        color: #ff0000;
        font-size: 16px;
      }
    }

    .message-nickname {
      height: 20px;
      line-height: 22px;
      font-size: 12px;
      font-weight: 400;
      padding-left: 10px;
      color: #4f4f4f;
      width: 350px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-wrap: normal;
    }

    .message-bubble {
      background-color: #ffffff;
      margin: 0 10px;
      max-width: 500px;
      min-height: 1em;
      display: inline-block;
      vertical-align: top;
      position: relative;
      text-align: left;
      font-size: 14px;
      border-radius: 3px;

      &::before,
      &::after {
        position: absolute;
        right: 100%;
        top: 14px;
        border: 6px solid transparent;
        content: ' ';
      }

      .bubble-content {
        word-wrap: break-word;
        word-break: break-all;
        min-height: 25px;
        color: #4e4a4a;

        .plain {
          padding: 9px 13px;

          .text-message {
            .text-content {
              display: inline;
            }
          }

          .img-message {
            img {
              max-width: 250px;
              min-width: 100px;
            }
            &-option {
              text-align: right;
              font-size: 13px;
            }
          }

          .file-message {
            display: flex;
            &-icon {
              width: 48px;
              padding: 10px 0;
              border-radius: 2px;
              text-align: center;
              opacity: 0.8;
              background-color: seashell;
              margin-right: 5px;
            }
            &-info {
              width: 185px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;

              .file-option {
                font-size: 13px;
                position: absolute;
                right: 20px;
                bottom: 9px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
