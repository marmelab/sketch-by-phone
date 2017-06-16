/* eslint jsx-a11y/img-redundant-alt: off */
import React from 'react';
import pan from './assets/pan.png';
import pinch from './assets/pinch.png';
import rotate from './assets/rotate.png';
import Media from 'react-media';

const styles = {
    tips: {
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth: 600,
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        bottom: '5rem',
        left: '1rem',
        right: '1rem',
        padding: '1rem',
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
    },
    item: {
        display: 'flex',
        alignItems: 'center',
    },
    text: {
        marginLeft: '1rem',
    }
};

styles.tipsLandscape = { ...styles.tips, flexDirection: 'row' };
styles.itemLandscape = { ...styles.item, flexDirection: 'column', maxWidth: 200 };

export default ({ onHide }) => (
    <Media
        query={{ orientation: 'landscape' }}
    >
        {matches => (
                <div style={matches ? styles.tipsLandscape : styles.tips} onClick={onHide}>
                    <div style={matches ? styles.itemLandscape : styles.item}>
                        <img alt="How to move the image" src={pan} />
                        <div style={styles.text}>Pan with your finger to drag the picture on the paper</div>
                    </div>
                    <div style={matches ? styles.itemLandscape : styles.item}>
                        <img alt="How to zoom the image" src={pinch} />
                        <div style={styles.text}>Pinch to zoom the picture in or out and fit the sheet</div>
                    </div>
                    <div style={matches ? styles.itemLandscape : styles.item}>
                        <img alt="How to rotate the image" src={rotate} />
                        <div style={styles.text}>Rotate your fingers to rotate the picture and orient it on the sheet</div>
                    </div>
                </div>
        )}
    </Media>
);
