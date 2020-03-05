import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../services/api';

import { Keyboard, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {
    Container,
    Form,
    Input,
    SubmitButton,
    List,
    User,
    Avatar,
    Name,
    Bio,
    ProfileButton,
    ProfileButtonText,
} from './styles';

export default function Main(props) {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function getUsersStorage() {
            const newUsers = await AsyncStorage.getItem('users');

            if (newUsers) {
                setUsers(JSON.parse(newUsers));
            }
        }

        getUsersStorage();
    }, []);

    useEffect(() => {
        async function setUsersStorage() {
            AsyncStorage.setItem('users', JSON.stringify(users));
        }

        setUsersStorage();
    }, [users]);

    async function handleAddUser() {
        setLoading(true);
        const response = await api.get(`/users/${newUser}`);

        const data = {
            name: response.data.name,
            login: response.data.login,
            bio: response.data.bio,
            avatar: response.data.avatar_url,
        };

        setNewUser('');
        setUsers([...users, data]);
        setLoading(false);

        Keyboard.dismiss();
    }

    function handleNavigate(user) {
        const { navigation } = props;

        navigation.navigate('User', { user });
    }

    return (
        <Container>
            <Form>
                <Input
                    autoCorrect={false}
                    autoCapitalize="none"
                    placeholder="Adicionar usuário"
                    value={newUser}
                    onChangeText={text => setNewUser(text)}
                    returnKeyType="send"
                    onSubmitEditing={handleAddUser}
                />
                <SubmitButton loading={loading} onPress={handleAddUser}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Icon name="add" size={20} color="#FFF" />
                    )}
                </SubmitButton>
            </Form>
            <List
                data={users}
                keyExtractor={user => user.login}
                renderItem={({ item }) => (
                    <User>
                        <Avatar source={{ uri: item.avatar }} />
                        <Name>{item.name}</Name>
                        <Bio>{item.bio}</Bio>

                        <ProfileButton onPress={() => handleNavigate(item)}>
                            <ProfileButtonText>Ver perfil</ProfileButtonText>
                        </ProfileButton>
                    </User>
                )}
            />
        </Container>
    );
}

Main.propTypes = {
    navigation: PropTypes.shape({
        navigate: PropTypes.func,
    }).isRequired,
};

Main.navigationOptions = {
    title: 'Usuários',
};
