import React from "react";

const UnorderedUniqueStringList = React.memo(function({strings}: {strings: readonly string[]}) {
	let items = strings.map((string) =>
		<li key={string}>{string}</li>
	);
	
	return <ul>
		{items}
	</ul>;
});

export default UnorderedUniqueStringList;