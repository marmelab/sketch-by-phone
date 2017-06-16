
import React from 'react';
import hiro from './assets/hiro.png';

const styles = {
    container: {
        position: 'absolute',
        bottom: '5rem',
        left: 0,
        right: 0,
        textAlign: 'center',
        padding: 'auto auto',
    },
    content: {
        display: 'inline-block',
        color: 'red',
        borderColor: 'red',
        borderWidth: 2,
        borderStyle: 'solid',
        maxWidth: 200,
        fontWeight: 'bold',
        fontSize: '1.5rem',
        padding: 10,
    },
    img: {
        marginTop: '1rem',
        height: '5rem',
        width: '5rem',
    }
};

export default () => (
    <div style={styles.container}>
        <div style={styles.content}>
            Looking for Hiro Marker
            <img style={styles.img} alt="Hiro marker example" src={hiro} />
        </div>
    </div>
);
