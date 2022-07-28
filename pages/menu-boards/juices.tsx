import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Error from "next/error";
import { useRouter } from "next/router";
import { useEffect } from "react";
import ExtraItem from "../../components/ExtraItem";
import Footnote from "../../components/Footnote";
import Heading from "../../components/Heading";
import Heading2 from "../../components/Heading2";
import Heading3 from "../../components/Heading3";
import MenuItemDescription from "../../components/MenuItemDescription";
import MenuItemHeading from "../../components/MenuItemHeading";
import Subheading from "../../components/Subheading";
import { MenuData } from "../../types";
import { getTag } from "../../utils";

export interface JuicesProps {
  errorCode?: number;
  errorTitle?: string;
  data?: MenuData;
  footnote?: string;
}

const menuApi = "https://menu-api.raydiant.com/v1/groups";
const apiKey = process.env.RAYDIANT_MENU_API_KEY ?? "";

export const getServerSideProps: GetServerSideProps<JuicesProps> = async (context) => {
  const menu = context.query.menu;
  const footnote = context.query.footnote as string;

  // Set the response status code to BadRequest if missing the menu query param.
  if (!menu) {
    context.res.statusCode = 400;
    return {
      props: {
        errorCode: context.res.statusCode,
        errorTitle: "Please provide a menu",
      },
    };
  }

  // Make request to the On-Brand Menu API.
  const res = await fetch(`${menuApi}?tags=juices&menus=${menu}&depth=4`, {
    headers: { "X-API-Key": apiKey },
  });
  // Forward the response status code from the On-Brand Menu API.
  if (!res.ok) {
    context.res.statusCode = res.status;
    return {
      props: {
        errorCode: context.res.statusCode,
        errorTitle: `Failed to load juices menu for ${menu}`,
      },
    };
  }

  const data = await res.json();
  const juicesData = data.groups[0];

  return {
    props: {
      data: juicesData,
      footnote,
    },
  };
};

const Juices: NextPage<JuicesProps> = ({ errorCode, errorTitle, data, footnote }) => {
  const router = useRouter();

  useEffect(() => {
    const refreshData = () => {
      router.replace(router.asPath);
    };

    const id = setInterval(() => {
      refreshData();
    }, 30000);

    return () => clearInterval(id);
  }, [router]);

  if (errorCode) {
    return <Error statusCode={errorCode} title={errorTitle} />;
  }

  if (!data) {
    return null;
  }

  const { name, items, groups } = data;
  const price = items[0].price;

  return (
    <>
      <Head>
        <title>{name}</title>
      </Head>

      <main className="flex">
        <section className="w-2/3 mb-12">
          <header className="flex items-end px-10 mt-2">
            <Heading>
              {name} ${price}
            </Heading>
            <div className="mb-[52px]">
              <Subheading>
                EA
                <br />
                16 OZ
              </Subheading>
            </div>
          </header>
          <div className="flex flex-wrap overflow-hidden mb-14">
            {items.map((x) => (
              <div key={x.id} className="w-1/2 my-5 px-10 overflow-hidden">
                <MenuItemHeading>
                  <span className={x.inStock ? "" : "line-through"}>{x.name}</span>{" "}
                  {x.calories && <span className="text-2xl">{x.calories} CAL</span>}
                </MenuItemHeading>
                <MenuItemDescription>{x.description}</MenuItemDescription>
              </div>
            ))}
          </div>
          <div className="absolute bottom-0 left-0 w-2/3">
            <Footnote>{footnote}</Footnote>
          </div>
        </section>

        <section className="w-1/3 p-12">
          <Heading2>Extras</Heading2>
          {groups.map((x) => {
            const price = x.items[0].price;
            return (
              <div key={x.id} className="mb-10 last:mb-0">
                <Heading3>
                  {x.name} ${price}
                </Heading3>
                {x.items.map((x) => (
                  <div className="mb-3 last:mb-0" key={x.id}>
                    <ExtraItem>
                      {x.name} adds {x.calories === null ? getTag(x.tags, "calories") : x.calories}{" "}
                      Cal
                    </ExtraItem>
                  </div>
                ))}
              </div>
            );
          })}
        </section>
      </main>
    </>
  );
};

export default Juices;
