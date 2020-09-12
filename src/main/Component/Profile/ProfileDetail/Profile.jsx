import React, { useContext, useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import { Layout, Button, PageHeader, Descriptions, Tag, Modal, Row } from 'antd';
import { ProfileContext } from '../../../Layout/app';
import SettingModal from '../../Header/SettingModal';
import GenerateButton from '../../Action/GenerateButton';
import TeardownButton from '../../Action/TeardownButton'
import Result from './Result';

const { Content } = Layout;
let now = new Date().toLocaleString();

const Profile = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(true);
    const { profiles, setProfiles } = useContext(ProfileContext);
    const hash = window.location.hash.toString();
    const profileId = hash.slice(10);
    const CONFIRM_DELETE_WARNING = "Are you sure to delete this profile ? This action CAN NOT be reverted.";
    const data = profiles.filter(obj => obj.profileId === profileId);
    const [newProfiles, setNewProfiles] = useState(JSON.stringify(data[0]));
    let dataProfile;
    let color;
    let defaultValue = {
        name: '',
        domain: '',
        username: '',
        password: '',
        profileId: '',
        status: ''
    }


    const removeProfile = (profileId) => {
        let profilesRemain = [...profiles]
        const result = profilesRemain.filter(obj => obj.profileId !== profileId);
        window.localStorage.setItem('profiles', JSON.stringify(result));
        setProfiles(result);
    };

    useEffect(() => {
        let profilesCopy = [...profiles];
        let result = profilesCopy.filter(obj => obj.profileId === profileId);
        setNewProfiles(JSON.stringify(result[0]))
    }, [profiles])

    if (newProfiles !== undefined) {
        const result = JSON.parse(newProfiles);
        dataProfile = result;
    } else {
        dataProfile = defaultValue;
    }

    if (dataProfile.status === "PROCESSING") {
        color = 'green';
    }
    else if (dataProfile.status === "DONE") {
        color = 'yellow';
    } else {
        color = 'blue';
    }

    return (
        <div className="site-page-header-ghost-wrapper">
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={"Profile " + dataProfile.name}
                extra={[
                    <GenerateButton key="4" rowProfileId={profileId}></GenerateButton>,
                    <TeardownButton key="3" rowProfileId={profileId}></TeardownButton>,
                    <Button
                        key="2"
                        type="default"
                        onClick={() => {
                            setModalVisible(true)
                        }}>
                        Edit</Button>,
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
                                    window.history.back();
                                    removeProfile(profileId);
                                },
                                onCancel() {
                                    setDeleteModalVisible(false);
                                },
                            })
                        }}>
                        Delete
                    </Button>
                ]}
            >
                <Descriptions size="middle" column={3} bordered={true}>
                    <Descriptions.Item label="Domain">{dataProfile.domain}</Descriptions.Item>
                    <Descriptions.Item label="Username">{dataProfile.username}</Descriptions.Item>
                    <Descriptions.Item label="Password">******</Descriptions.Item>
                    <Descriptions.Item label="Profile ID">{dataProfile.profileId}</Descriptions.Item>
                    <Descriptions.Item label="Status">{<Tag color={color}>{dataProfile.status}</Tag>}</Descriptions.Item>
                    <Descriptions.Item label="Running Time">{now}</Descriptions.Item>
                </Descriptions>
            </PageHeader>
            <SettingModal
                profileId={profileId}
                isVisible={modalVisible}
                onClose={() => setModalVisible(false)} />
            <Content>
                <Row style={{ padding: '24px' }}>
                    <Result profile={newProfiles} />
                </Row>
            </Content>
        </div>
    )
}
export default Profile;