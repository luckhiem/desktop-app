import React, { useState, useContext } from 'react';
import { Button, Modal } from 'antd';
import { ProfileContext, HistoryContext } from '../../../Layout/app';

const DeleteButton = (profileId) => {
    const { profiles, setProfiles } = useContext(ProfileContext);
    const { history, setHistory } = useContext(HistoryContext);
    const [deleteModalVisible, setDeleteModalVisible] = useState(true);
    const CONFIRM_DELETE_WARNING = "Are you sure to delete this profile ? This action CAN NOT be reverted.";
    const hash = window.location.hash.toString();

    const removeProfile = (profileId) => {
        let profilesRemain = [...profiles]
        const result = profilesRemain.filter(obj => obj.profileId !== profileId);
        window.localStorage.setItem('profiles', JSON.stringify(result));
        setProfiles(result);
    };

    const removeHistory = (profileId) => {
        let historyRemain = [...history]
        const result = historyRemain.filter(obj => obj.profileId !== profileId);
        window.localStorage.setItem('history', JSON.stringify(result));
        setHistory(result);
    };

    return (
        <Button
            key="1"
            type="primary"
            danger
            onClick={() => {
                Modal.confirm({
                    title: 'Delete Profile',
                    content: CONFIRM_DELETE_WARNING,
                    isVisible: deleteModalVisible,
                    onOk() {
                        if (hash === `#/`) {
                            removeProfile(profileId.profileId);
                            removeHistory(profileId.profileId)
                        } else {
                            window.history.back()
                            removeProfile(profileId.profileId);
                            removeHistory(profileId.profileId)
                        }
                    },
                    onCancel() {
                        setDeleteModalVisible(false);
                    },
                })
            }}>
            Delete
        </Button>
    )
}

export default DeleteButton