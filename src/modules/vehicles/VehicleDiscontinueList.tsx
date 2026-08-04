import CustomButton from '@components/buttons/CustomButton';
import AppHeader from '@components/custumcomponents/AppHeader';
import CustomInput from '@components/Inputs/CustomInput';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '@utils/colors';
import commonstyles from '@utils/commonstyles';
import { hp, moderateScale, normalizeFont, wp } from '@utils/responsive';
import { Formik } from 'formik';
import { Alert, Text, View } from 'react-native';
import { StyleSheet } from 'react-native';
import { Rating } from 'react-native-ratings';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDeleteassignvehicleMutation, useDeletevehicleMutation } from '@app/redux/mutation/authApi';
import { useSelector } from 'react-redux';
import { RootState } from '@app/redux';


export default function VehicleDiscontinueList() {
  const navigation = useNavigation<any>()
  const vendorid = useSelector(
    (state: RootState) => state.auth.user?.id,
  );

  console.log(vendorid)
  const route = useRoute<any>();
  const vehicle = route.params?.vehicle;
  const [deleteVehicle, { isLoading }] =
    useDeletevehicleMutation();
  return (
    <View style={commonstyles.container}>
      <AppHeader title="Discontinue Vehicle" />
      <Formik
        initialValues={{
          vehcleno: vehicle?.registration_no || '',
          drivername: vehicle?.full_name,
          reason: '',
          rating: 0,
        }}
        onSubmit={async values => {
          try {
            const payload = {
              vendorid: vendorid || '',
              vehicleid: vehicle?.vehicleid || '',
              // driverName: values.drivername || '',
              remark: values.reason || '',
              RatingValue : values.rating || 0,
            };

            const response = await deleteVehicle(payload).unwrap();

            if (response.status === '00') {
              Alert.alert('Success', response?.message);
              navigation.goBack();
            } else {
              Alert.alert('Failed', response?.message);
            }
          } catch (error: any) {
            Alert.alert(
              'Error',
              error?.data?.message || 'Something went wrong',
            );
          }
        }}
      >
        {({ handleSubmit, setFieldValue, values }) => (
          <View style={commonstyles.p20}>
            <CustomInput
              name="vehcleno"
              label="Vehicle Number"
              editable={false}
            />
            <View style={styles.icon}>
              <MaterialIcons name="open-in-full" size={30} color="#000" />
            </View>

            <CustomInput name="drivername" label="Driver Name" />

            <CustomInput name="reason" label="Reason" style={styles.input} />

            {/* ⭐ Rating */}
            <Text style={styles.label}>Driver Rating</Text>

            <View style={styles.ratingCard}>
              <Rating
                type="star"
                ratingCount={5}
                imageSize={moderateScale(26)} // ✅ responsive
                startingValue={values.rating}
                onFinishRating={(rating: number) =>
                  setFieldValue('rating', rating)
                }
              />

              <Text style={styles.ratingText}>{values.rating} / 5</Text>
            </View>

            <CustomButton title="Submit" style={styles.button} textStyle={styles.submit} onPress={handleSubmit} />
          </View>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  ratingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: moderateScale(1),
    borderColor: colors.border,
    borderRadius: moderateScale(10),
    paddingVertical: hp(1.8), // ✅ responsive height
    paddingHorizontal: wp(4), // ✅ responsive width
    marginBottom: hp(2),
  },

  ratingText: {
    fontSize: normalizeFont(14), // ✅ responsive font
    fontWeight: '600',
    color: '#444',
  },

  label: {
    fontSize: normalizeFont(13), // ✅ responsive font
    fontWeight: '600',
    marginBottom: hp(0.8),
    color: colors.text,
  },

  input: {
    minHeight: hp(7), // ✅ instead of maxHeight
  },
  icon: {
    alignItems: 'center',
    transform: [{ rotate: '-45deg' }],
    paddingVertical: wp(2),
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: 213,
    height: 56,

  },
  submit: {
    fontSize: 24
  }
});
