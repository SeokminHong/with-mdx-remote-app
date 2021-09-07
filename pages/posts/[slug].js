import nookies from 'nookies';

export default function Page() {
  return null;
}

export async function getServerSideProps(context) {
  const cookies = nookies.get(context);

  return {
    redirect: {
      destination: `${context.params.slug}/${cookies['my-lang']}`,
      permanent: true,
      replace: true,
    },
  };
}
