import React, {useState, useEffect, useMemo} from 'react'
import {View} from 'react-native'
import {observer} from 'mobx-react-lite'
import {Feed} from '../com/posts/Feed'
import {FAB} from '../com/util/FloatingActionButton'
import {useStores} from '../../state'
import {FeedModel} from '../../state/models/feed-view'
import {ComposePostModel} from '../../state/models/shell'
import {ScreenParams} from '../routes'
import {s} from '../lib/styles'

export const Home = observer(function Home({
  visible,
  scrollElRef,
}: ScreenParams) {
  const store = useStores()
  const [hasSetup, setHasSetup] = useState<boolean>(false)
  const defaultFeedView = useMemo<FeedModel>(
    () =>
      new FeedModel(store, 'home', {
        algorithm: 'reverse-chronological',
      }),
    [store],
  )

  useEffect(() => {
    if (!visible) {
      return
    }
    if (hasSetup) {
      console.log('Updating home feed')
      defaultFeedView.update()
    } else {
      store.nav.setTitle('Home')
      console.log('Fetching home feed')
      defaultFeedView.setup().then(() => setHasSetup(true))
    }
  }, [visible, store])

  const onComposePress = () => {
    store.shell.openModal(new ComposePostModel({onPost: onCreatePost}))
  }
  const onCreatePost = () => {
    defaultFeedView.loadLatest()
  }

  return (
    <View style={s.flex1}>
      <Feed key="default" feed={defaultFeedView} scrollElRef={scrollElRef} />
      <FAB icon="pen-nib" onPress={onComposePress} />
    </View>
  )
})
