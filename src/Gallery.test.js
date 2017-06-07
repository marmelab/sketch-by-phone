import React from 'react';
import { shallow } from 'enzyme';
import Gallery from './Gallery';
import GalleryItem from './GalleryItem';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RaisedButton from 'material-ui/RaisedButton';

describe('<Gallery />', () => {
    const muiTheme = getMuiTheme();

    it('renders without crashing', () => {
        shallow(<Gallery />, { context: { muiTheme } });
    });

    it('triggers onClose when clicking the cancel button', () => {
        const onClose = jest.fn();

        const wrapper = shallow(<Gallery onClose={onClose} images={['image1', 'image2']} />, { context: { muiTheme } });
        wrapper.find(RaisedButton).simulate('click');
        expect(onClose).toHaveBeenCalled();
    });

    it('renders a list of GalleryItem', () => {
        const wrapper = shallow(<Gallery images={['image1', 'image2']} />, { context: { muiTheme } });
        const items = wrapper.find(GalleryItem);
        expect(items.length).toEqual(2);
    });
});
