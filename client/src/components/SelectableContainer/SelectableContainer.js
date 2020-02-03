import React from 'react';
import PropTypes from 'prop-types';
import Selectable from 'src/components/Selectable/Selectable';

export default function SelectableContainer(props) {
  return (
    <div>
      {Object.entries(props.options).map(
        ([option, label]) => (
          <Selectable
            isSelected={
              props.multiselect
                ? props.value[option]
                : props.value === option
            }
            onClick={() => props.onSelect(option)}
            key={option}
          >
            {label}
          </Selectable>
        ),
        this,
      )}
    </div>
  );
}

SelectableContainer.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  options: PropTypes.object.isRequired,
  multiselect: PropTypes.bool,
  onSelect: PropTypes.func,
};
