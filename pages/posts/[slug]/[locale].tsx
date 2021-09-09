import fs from 'fs';
import matter from 'gray-matter';
import { InferGetStaticPropsType, GetStaticProps } from 'next';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Link from 'next/link';
import path from 'path';
import CustomLink from '../../../components/CustomLink';
import Layout from '../../../components/Layout';
import { Locale } from '../../../utils/locale';
import { postFilePaths, POSTS_PATH } from '../../../utils/mdxUtils';

// Custom components/renderers to pass to MDX.
// Since the MDX files aren't loaded by webpack, they have no knowledge of how
// to handle import statements. Instead, you must include components in scope
// here.
const components = {
  a: CustomLink,
  // It also works with dynamically-imported components, which is especially
  // useful for conditionally loading components for certain routes.
  // See the notes in README.md for more details.
  TestComponent: dynamic(() => import('../../../components/TestComponent')),
  Head,
};

export default function PostPage({
  source,
  frontMatter,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout>
      <header>
        <nav>
          <Link href="/">
            <a>👈 Go back home</a>
          </Link>
        </nav>
      </header>
      <div className="post-header">
        <h1>{frontMatter.title}</h1>
        {frontMatter.description && (
          <p className="description">{frontMatter.description}</p>
        )}
      </div>
      <main>
        <MDXRemote {...source} components={components} />
      </main>

      <style jsx>{`
        .post-header h1 {
          margin-bottom: 0;
        }

        .post-header {
          margin-bottom: 2rem;
        }
        .description {
          opacity: 0.6;
        }
      `}</style>
    </Layout>
  );
}

type ParamType = { slug: string; locale: Locale };

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postFilePath = path.join(
    POSTS_PATH,
    `${params!.slug}/${params!.locale}.mdx`
  );
  const source = fs.readFileSync(postFilePath);

  const { content, data } = matter(source);

  const mdxSource = await serialize(content, {
    // Optionally pass remark/rehype plugins
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [],
    },
    scope: data,
  });

  return {
    props: {
      source: mdxSource,
      frontMatter: data,
    },
    revalidate: 1,
  };
};

export const getStaticPaths = async () => {
  const paths = Object.entries(postFilePaths)
    // Make all cominations of locale and slug
    .reduce(
      (acc, [slug, locales]) => [
        ...acc,
        ...locales.map((locale) => ({ params: { slug, locale } })),
      ],
      [] as { params: ParamType }[]
    );

  return {
    paths,
    fallback: false,
  };
};
