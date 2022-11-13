import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Photo, useAlbum} from '../hooks/useAlbum';
import {consoleCount} from '../utils';

export default function HomeScreen(): React.ReactElement {
  const {data, onLoadNext} = useAlbum(100);

  const [photoIds, setPhotoIds] = useState<string[]>([]);

  const PhotoViewItem = useCallback(({item}: {item: Photo}) => {
    return (
      <PhotoView
        key={item.id}
        selected={photoIds.indexOf(item.id) > -1}
        photo={item}
        onPress={photo => {
          setPhotoIds(([...draft]) => {
            const idx = draft.indexOf(photo.id);

            if (idx > -1) {
              draft.splice(idx, 1);
            } else {
              draft.push(photo.id);
            }

            return draft;
          });
        }}
      />
    );
  }, [])

  const keyExtractor = useCallback(key => key.id.toString(), []);

  return (
    <View style={styles.container}>
      <FlatList
        keyExtractor={keyExtractor}
        maxToRenderPerBatch={8}
        windowSize={10}
        removeClippedSubviews={true}
        contentContainerStyle={styles.sectionContainer}
        numColumns={3}
        data={data}
        renderItem={PhotoViewItem}
        onEndReached={onLoadNext}
      />
    </View>
  );
}

type PhotoViewProps = {
  selected: boolean;
  photo: Photo;
  onPress: (photo: Photo) => void;
};

const PhotoView = ({photo, onPress, selected}: PhotoViewProps) => {
  const [loading, setLoading] = useState(true);

  consoleCount('render PhotoView:' + photo.id);

  useEffect(() => {
    return () => {
      consoleCount('unmount PhotoView:' + photo.id);
    };
  }, []);

  return (
    <Pressable style={styles.image} onPress={() => onPress(photo)}>
      <FastImage
        onLoadEnd={() => setLoading(false)}
        resizeMode={'cover'}
        source={{uri: photo.url}}
        style={StyleSheet.absoluteFill}
      />
      {!loading && (
        <View
          style={[
            styles.mark,
            {backgroundColor: selected ? '#3175ff' : '#f8f8f8'},
          ]}
        />
      )}
      {loading && (
        <ActivityIndicator style={StyleSheet.absoluteFill} color={'#363638'} />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  sectionContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  image: {
    borderColor: 'white',
    borderWidth: 1,
    width: '33.3%',
    height: 120,
    aspectRatio: 1,
  },
  mark: {
    borderWidth: 1,
    borderColor: 'gray',
    width: 16,
    height: 16,
    borderRadius: 8,
    position: 'absolute',
    right: 5,
    top: 5,
  },
});
