<template>
  <a-tree class="contacts-tree" :treeData="contactsTree" @select="handleSelect" :defaultExpandAll="false">

    <!-- 组织节点 -->
    <template slot="orgNode" slot-scope="{title}">
      <a-icon type="folder" class="org-node-icon"></a-icon>
      <span class="org-node-title">{{ title }}</span>
    </template>

    <!-- 用户节点 -->
    <template slot="userNode" slot-scope="{title, icon, online}">

      <a-avatar :class="['user-node-avatar', online ? '' : 'off-line']" shape="square" :src="icon" :size="24">
        {{ title.slice(0, 1) }}
      </a-avatar>

      <span :class="['user-node-title', online ? '' : 'off-line']">{{ title }}</span>
    </template>

  </a-tree>
</template>

<script>
export default {
  name: 'ContactsTree',
  props: {
    /**
     * 联系人结构树
        {
          title: '十一室',
          icon: 'folder',
          key: '0-1-1',
          scopedSlots: {
            title: 'orgNode'
          },
          children: [
            {
              title: '三块五',
              icon: '/avatar2.jpg',
              key: '0-1-1-1',
              online: true,
              scopedSlots: {
                title: 'userNode'
              }
            }
          ]
        }
     */
    contactsTree: {
      type: Array,
      required: true
    }
  },
  data () {
    return {}
  },
  methods: {
    handleSelect (selectedKeys, { selectedNodes }) {
      if (selectedNodes.length) {
        if (selectedNodes[0].data.props.dataRef.scopedSlots.title === 'userNode') {
          this.$emit('SelectContacts', selectedKeys[0])
        }
      }
    }
  }
}

</script>

<style lang="less" scoped>
  .off-line {
    color: #8f9498!important;
    -webkit-filter: grayscale(100%)!important;
    filter: grayscale(100%)!important;
  }
  .contacts-tree {
    .org-node-icon {
      font-size: 16px;
      margin-right: 3px;
    }
    .org-node-title {
      font-size: 16px;
    }

    .user-node-avatar {
      border-radius: 2px;
      margin:0 5px 4px 0px;
      background-color: #4da6fa;
      span {
        color: #fff;
      }
    }
    .user-node-title {
      color: black;
      font-size: 14px;
      line-height: 24px;
    }
  }
</style>
