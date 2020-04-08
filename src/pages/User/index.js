import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';

import { ActivityIndicator } from 'react-native';

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
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const user = navigation.getParam('user');

    async function getStars(pageRequest = 1) {
        setLoading(true);
        const response = await api.get(`/users/${user.login}/starred`, {
            params: {
                per_page: 5,
                page: pageRequest,
            },
        });

        setStars(page >= 2 ? [...stars, ...response.data] : response.data);
        setLoading(false);
        setPage(pageRequest);
    }

    useEffect(() => {
        getStars();
    }, []);

    async function loadMore() {
        const nextPage = page + 1;

        getStars(nextPage);
    }

    return (
        <Container>
            <Header>
                <Avatar source={{ uri: user.avatar }} />
                <Name>{user.name}</Name>
                <Bio>{user.bio}</Bio>
            </Header>
            {stars.length > 0 && (
                <Stars
                    onEndReachedThreshold={0.2}
                    onEndReached={loadMore}
                    data={stars}
                    keyExtractor={star => String(star.id)}
                    renderItem={({ item }) => (
                        <Starred>
                            <OwnerAvatar
                                source={{ uri: item.owner.avatar_url }}
                            />
                            <Info>
                                <Title>{item.name}</Title>
                                <Author>{item.owner.login}</Author>
                            </Info>
                        </Starred>
                    )}
                />
            )}
            {loading && <ActivityIndicator color="#7159c1" />}
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
