import { wp } from '@utils/responsive';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';

interface ImageFile {
  uri: string;
  type: string;
  fileName: string;
}
interface Props {
  label?: string;
  returnType?: 'uri' | 'base64';
  onImageSelected?: (
    image: string | ImageFile,
  ) => void;
  containerStyle?: any;
  imageStyle?: any;
}

export default function CustomImagePicker({
  label,
  returnType = 'uri',
  onImageSelected,
  containerStyle,
  imageStyle,
}: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  /* ---------------- PERMISSION ---------------- */
  const requestCameraPermission = async () => {
    if (Platform.OS === 'ios') return true;

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs camera permission to take pictures',
          buttonPositive: 'OK',
        },
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  /* ---------------- CAMERA ---------------- */
  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

 const result: ImagePickerResponse =
  await launchCamera({
    mediaType: 'photo',
    includeBase64:
      returnType === 'base64',
    quality: 0.8,
    maxHeight: 1500,
    maxWidth: 1500,
    presentationStyle:
      'fullScreen' as const,
  });

    handleResult(result);
  };

  /* ---------------- GALLERY ---------------- */
  const openGallery = async () => {
 const result: ImagePickerResponse =
  await launchCamera({
    mediaType: 'photo',
    includeBase64:
      returnType === 'base64',
    quality: 0.8,
    maxHeight: 1500,
    maxWidth: 1500,
    presentationStyle:
      'fullScreen' as const,
  });

    handleResult(result);
  };

  /* ---------------- RESULT ---------------- */
  // const handleResult = (result: ImagePickerResponse) => {
  //   setModalVisible(false);

  //   if (result.assets && result.assets.length > 0) {
  //     const asset = result.assets[0];

  //     if (asset?.uri) {
  //       setImageUri(asset.uri);
  //     }

  //     if (asset?.base64 && onImageSelected) {
  //       onImageSelected(asset.base64);
  //     }
  //   }
  // };
const handleResult = (
  result: ImagePickerResponse,
) => {
  setModalVisible(false);

  if (
    result.assets &&
    result.assets.length > 0
  ) {
    const asset = result.assets[0];

    if (asset?.uri) {
      setImageUri(asset.uri);
    }

    if (!onImageSelected) return;

    if (returnType === 'base64') {
      const mimeType =
        asset.type || 'image/jpeg';

      const base64WithPrefix = `data:${mimeType};base64,${asset.base64}`;

      onImageSelected(base64WithPrefix);
    } else {
      onImageSelected({
        uri: asset.uri!,
        type:
          asset.type || 'image/jpeg',
        fileName:
          asset.fileName ||
          `image_${Date.now()}.jpg`,
      });
    }
  }
};

  /* ---------------- REMOVE ---------------- */
const handleRemove = () => {
  setImageUri(null);
  setModalVisible(false);

  if (returnType === 'base64') {
    onImageSelected?.('');
  } else {
    onImageSelected?.({
      uri: '',
      type: '',
      fileName: '',
    });
  }
};

  return (
    <>
      {/* IMAGE BOX */}
      <TouchableOpacity
        style={[styles.imageBox, containerStyle]}
        onPress={() => setModalVisible(true)}
      >
        {imageUri ? (
          <>
            <Image
              source={{ uri: imageUri }}
              style={[styles.image, imageStyle]}
            />

            {/* Remove Button */}
            <TouchableOpacity style={styles.removeBtn} onPress={handleRemove}>
              <Icon name="close" size={16} color="#dd0000" />
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.placeholderContainer}>
            <Icon name="camera-outline" size={24} color="#777" />
            <Text style={styles.placeholder}>{label}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.option} onPress={openCamera}>
              <Icon name="camera-outline" size={24} color="#777" />
              <Text style={styles.optionText}>Open Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={openGallery}>
              <Icon name="image-outline" size={24} color="#777" />
              <Text style={styles.optionText}>Choose from Gallery</Text>
            </TouchableOpacity>

            {/* Remove Option */}
            {imageUri && (
              <TouchableOpacity style={styles.option} onPress={handleRemove}>
                <Icon name="trash-outline" size={24} color="red" />
                <Text style={[styles.optionText, { color: 'red' }]}>
                  Remove Image
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.cancel}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  imageBox: {
    width: '100%',
    height: wp(25),
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F1F1F1',
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  placeholderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  placeholder: {
    fontSize: 12,
    color: '#777',
  },

  removeBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10, // ✅ ADD THIS
    elevation: 10, // ✅ AND THIS (Android)
  },

  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },

  optionText: {
    fontSize: 16,
    marginLeft: 10,
  },

  cancel: {
    marginTop: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },

  cancelText: {
    color: 'red',
    fontWeight: '600',
  },
});
