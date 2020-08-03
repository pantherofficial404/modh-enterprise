// Libraries
import React from 'react';
import clsx from 'clsx';
import { FlexDirectionProperty } from 'csstype';

// Project files
import useStyle from './view.style';

interface IProps {
  flexGrow?: boolean;
  flexDirection?: FlexDirectionProperty;
  style?: React.CSSProperties;
  className?: string;
  alignItems?: 'center';
  justifyContent?: 'center' | 'end';
  divRef?: any;
}

const View: React.FC<IProps & React.HTMLAttributes<HTMLDivElement>> = (props) => {
  const classes = useStyle();
  const { className, style, flexGrow, flexDirection, alignItems, justifyContent, children, divRef, ...rest } = props;
  const viewStyles: React.CSSProperties = {};

  if (flexDirection) {
    viewStyles.flexDirection = flexDirection;
  }
  if (alignItems) {
    viewStyles.alignItems = alignItems;
  }
  if (justifyContent) {
    viewStyles.justifyContent = justifyContent;
  }

  return (
    <div
      className={clsx(classes.root, {
        [classes.flexGrow]: flexGrow,
      },
        className,
      )}
      style={{ ...style, ...viewStyles }}
      ref={divRef}
      {...rest}
    >
      {children}
    </div>
  );
};

export default View;