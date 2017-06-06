import React from 'react';
import { shallow } from 'enzyme';
import Gallery from './Gallery';
import GalleryItem from './GalleryItem';

describe('<Gallery />', () => {
    it('renders without crashing', () => {
        shallow(<Gallery />);
    });

    it('triggers onClose when clicking the cancel button', () => {
        const onClose = jest.fn();

        const wrapper = shallow(<Gallery onClose={onClose} images={['image1', 'image2']} />);
        wrapper.find('button').simulate('click');
        expect(onClose).toHaveBeenCalled();
    });

    it('renders a list of GalleryItem', () => {
        const wrapper = shallow(<Gallery images={['image1', 'image2']} />);
        const items = wrapper.find(GalleryItem);
        expect(items.length).toEqual(2);
    });
});
