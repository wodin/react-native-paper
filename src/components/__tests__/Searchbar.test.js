import * as React from 'react';

import { fireEvent, render } from '@testing-library/react-native';
import renderer from 'react-test-renderer';

import * as Avatar from '../Avatar/Avatar.tsx';
import Searchbar from '../Searchbar.tsx';

it('renders with placeholder', () => {
  const tree = renderer.create(<Searchbar placeholder="Search" />).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders with text', () => {
  const tree = renderer
    .create(<Searchbar placeholder="Search" value="query" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('activity indicator snapshot test', () => {
  const tree = renderer.create(<Searchbar loading={true} />).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders with ActivityIndicator', () => {
  const tree = render(<Searchbar loading={true} />);

  expect(tree.getByTestId('activity-indicator')).toBeTruthy();
});

it('renders without ActivityIndicator', () => {
  const { getByTestId } = render(<Searchbar loading={false} />);

  expect(() => getByTestId('activity-indicator')).toThrow();
});

it('renders clear icon with custom color', () => {
  const { getByTestId } = render(
    <Searchbar testID="search-bar" value="value" iconColor="purple" />
  );

  const iconComponent = getByTestId('search-bar-icon-wrapper').props.children;

  expect(iconComponent.props.iconColor).toBe('purple');
});

it('renders clear icon wrapper, which can be the target of touch events, if search has value', () => {
  const { getByTestId } = render(
    <Searchbar testID="search-bar" value="value" />
  );

  expect(getByTestId('search-bar-icon-wrapper').props.pointerEvents).toBe(
    'auto'
  );
});

it('renders clear icon wrapper, which is never target of touch events, if search has no value', () => {
  const { getByTestId } = render(<Searchbar testID="search-bar" value="" />);

  expect(getByTestId('search-bar-icon-wrapper').props.pointerEvents).toBe(
    'none'
  );
});

it('renders clear icon wrapper, with appropriate style for v3', () => {
  const { getByTestId, update } = render(
    <Searchbar testID="search-bar" value="" />
  );

  expect(getByTestId('search-bar-icon-wrapper')).toHaveStyle({
    position: 'absolute',
    right: 0,
    marginLeft: 16,
  });

  update(
    <Searchbar
      testID="search-bar"
      value=""
      right={() => <Avatar.Text label="AB" size={30} />}
    />
  );

  expect(getByTestId('search-bar-icon-wrapper')).toHaveStyle({
    display: 'none',
  });
});

it('renders trailering icon when mode is set to "bar"', () => {
  const { getByTestId } = render(
    <Searchbar
      testID="search-bar"
      value={''}
      traileringIcon={'microphone'}
      mode="bar"
    />
  );

  expect(getByTestId('search-bar-trailering-icon')).toBeTruthy();
});

it('renders trailering icon with press functionality', () => {
  const onTraileringIconPressMock = jest.fn();

  const { getByTestId } = render(
    <Searchbar
      testID="search-bar"
      value={''}
      traileringIcon={'microphone'}
      onTraileringIconPress={onTraileringIconPressMock}
      mode="bar"
    />
  );

  fireEvent(getByTestId('search-bar-trailering-icon'), 'onPress');
  expect(onTraileringIconPressMock).toHaveBeenCalledTimes(1);
});

it('renders clear icon instead of trailering icon', () => {
  const { getByTestId, update, queryByTestId } = render(
    <Searchbar
      testID="search-bar"
      value={''}
      traileringIcon={'microphone'}
      mode="bar"
    />
  );

  expect(getByTestId('search-bar-trailering-icon')).toBeTruthy();

  update(
    <Searchbar
      testID="search-bar"
      value={'test'}
      traileringIcon={'microphone'}
      mode="bar"
    />
  );

  expect(queryByTestId('search-bar-trailering-icon')).toBeNull();
  expect(getByTestId('search-bar-icon-wrapper')).toBeTruthy();
});

it('renders searchbar in "view" mode', () => {
  const { getByTestId } = render(
    <Searchbar testID="search-bar" value={''} mode="view" />
  );

  expect(getByTestId('search-bar-container')).toHaveStyle({ borderRadius: 0 });
});
