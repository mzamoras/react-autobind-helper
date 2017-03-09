React Autobind Helper

```js
/** Basic Usage **/
import React from 'react';
import autobind from 'react-autobind-helper';

class example extends React.Component{
    constructor(props){
        super(props);
        autobind( this ); 
    }
}
```