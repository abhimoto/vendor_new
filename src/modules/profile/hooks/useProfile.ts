import { useEffect, useState } from 'react';

import {
    initialProfileValues,
    initialVehicles,
} from '../data/profileData';

import {
    ProfileValues,
    Vehicle,
} from '../types/profileTypes';

import {
    useUpdateprofileMutation,
} from '@app/redux/mutation/authApi';

import {
    useGetProfiledetailsQuery,
} from '@app/redux/query/queryApi';
import { Alert } from 'react-native';

export default function useProfile() {
    const {
        data,
        isLoading,
        isFetching,
        error,
        refetch,
    } = useGetProfiledetailsQuery();

    const [
        updateVendorProfile,
        {
            isLoading: isUpdating,
        },
    ] = useUpdateprofileMutation();

    const [values, setValues] =
        useState<ProfileValues>(
            initialProfileValues,
        );

    const [vehicles, setVehicles] =
        useState<Vehicle[]>(
            initialVehicles,
        );

 
    useEffect(() => {
        if (
            !data?.data ||
            !Array.isArray(data.data)
        ) {
            return;
        }

        const profile = data.data[0];

        if (!profile) {
            return;
        }

        setValues(prev => ({
            ...prev,

            vendorName:
                profile.OrganizationName || '',

            organizationType:
                profile.OrganizationType || '',

            authorizedPerson:
                profile.AuthorizedPerson || '',

            mobileNumber:
                profile.MobileNo || '',

            building:
                profile.Building || '',

            area:
                profile.Area || '',

            pincode:
                profile.Pincode || '',

            state:
                profile.State || '',

            district:
                profile.District || '',

            town:
                profile.Town || '',

            gstNumber:
                profile.GSTNo || '',

            panNumber:
                profile.PANNo || '',
        }));
    }, [data]);

  

    const handleChange = (
        key: keyof ProfileValues,
        value: string,
    ) => {
        setValues(prev => ({
            ...prev,
            [key]: value,
        }));
    };

 
    const handleUpdateProfile = async () => {
        try {
            const payload = {
                VendorName: values.vendorName,

                OrganizationName:
                    values.vendorName,

                OrganizationType:
                    values.organizationType,

                AuthorizedPerson:
                    values.authorizedPerson,

                MobileNo:
                    values.mobileNumber,

                Building:
                    values.building,

                Area:
                    values.area,

                Pincode:
                    values.pincode,

                State:
                    values.state,

                District:
                    values.district,

                Town:
                    values.town,

                GSTNo:
                    values.gstNumber,

                PANNo:
                    values.panNumber,
            };

            console.log(
                payload,
                'UPDATE PROFILE PAYLOAD',
            );

            const response =
                await updateVendorProfile(payload).unwrap();

            const result = response?.[0];

            if (result?.status === '00') {
                Alert.alert(
                    'Success',
                    result.message || 'Vendor profile updated successfully.',
                );

                await refetch();
            }

            await refetch();

            return response;

        } catch (err) {
            console.error(
                'UPDATE PROFILE ERROR:',
                err,
            );

            throw err;
        }
    };


    return {
        values,
        setValues,
        vehicles,
        setVehicles,
        handleChange,
        handleUpdateProfile,
        isLoading,
        isFetching,
        isUpdating,
        error,
        refetch,
    };
}