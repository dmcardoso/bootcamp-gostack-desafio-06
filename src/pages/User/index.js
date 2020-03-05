import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
    Container,
    Header,
    Avatar,
    Name,
    Bio,
    Stars,
    Starred,
    OwnerAvatar,
    Info,
    Title,
    Author,
} from './styles';

export default function User({ navigation }) {
    const [stars, setStars] = useState([]);
    const user = navigation.getParam('user');

    useEffect(() => {
        async function getStars() {
            const response = await api.get(`/users/${user.login}/starred`);

            setStars(response.data);
        }

        getStars();
    }, []);

    return (
        <Container>
            <Header>
                <Avatar source={{ uri: user.avatar }} />
                <Name>{user.name}</Name>
                <Bio>{user.bio}</Bio>
            </Header>
            <Stars
                data={stars}
                keyExtractor={star => String(star.id)}
                renderItem={({ item }) => (
                    <Starred>
                        <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                        <Info>
                            <Title>{item.name}</Title>
                            <Author>{item.owner.login}</Author>
                        </Info>
                    </Starred>
                )}
            />
        </Container>
    );
}

User.navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
});

User.propTypes = {
    navigation: PropTypes.shape({
        getParam: PropTypes.func,
    }).isRequired,
};
