function sleep( time = 0 ) {
	return new Promise( ( resolve ) => {
		setTimeout( resolve, time );
	} );
}

export default sleep;
