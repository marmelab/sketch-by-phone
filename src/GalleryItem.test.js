import React from 'react';
import { shallow } from 'enzyme';
import GalleryItem from './GalleryItem';

describe('<GalleryItem />', () => {
    it('renders without crashing', () => {
        shallow(<GalleryItem />);
    });

    it('trigger onSelected on click', () => {
        const onSelected = jest.fn();
        const wrapper = shallow(<GalleryItem image="the_image" onSelected={onSelected} />);
        wrapper.find('button').simulate('click');

        expect(onSelected).toHaveBeenCalledWith('the_image');
    });
});
