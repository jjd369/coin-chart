import store from '@/store/index'

export default function dispatchActionInit(actionName) {
  store.dispatch(actionName)
}
