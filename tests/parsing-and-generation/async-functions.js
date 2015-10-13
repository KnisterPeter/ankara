function promise() {
  return new Promise((resolve, reject) => {
      setTimeout(resolve, 0);
  });
}

export async function asyncFunction() {
  return await promise();
}
