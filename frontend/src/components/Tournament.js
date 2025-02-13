import { A, useParams } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { trophy } from "solid-heroicons/solid";
import { createEffect, createSignal, For, Match, Show, Switch } from "solid-js";

import { fetchTeams, fetchTournamentBySlug } from "../queries";
import Breadcrumbs from "./Breadcrumbs";

const Tournament = () => {
  const params = useParams();
  const [teamsMap, setTeamsMap] = createSignal({});

  const tournamentQuery = createQuery(
    () => ["tournament", params.slug],
    () => fetchTournamentBySlug(params.slug)
  );
  const teamsQuery = createQuery(() => ["teams"], fetchTeams);

  createEffect(() => {
    if (teamsQuery.status === "success") {
      let newTeamsMap = {};
      teamsQuery.data.map(team => {
        newTeamsMap[team.id] = team;
      });
      setTeamsMap(newTeamsMap);
    }
  });

  return (
    <Show
      when={!tournamentQuery.data?.message}
      fallback={
        <div>
          Tournament could not be fetched. Error -{" "}
          {tournamentQuery.data.message}
          <A href={"/tournaments"} class="text-blue-600 dark:text-blue-500">
            <br />
            Back to Tournaments Page
          </A>
        </div>
      }
    >
      <Breadcrumbs
        icon={trophy}
        pageList={[{ url: "/tournaments", name: "All Tournaments" }]}
      />

      <h1 class="mb-5 text-center">
        <span class="w-fit bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-2xl font-extrabold text-transparent">
          {tournamentQuery.data?.event?.title}
        </span>
      </h1>

      <Show
        when={tournamentQuery.data?.logo_dark}
        fallback={
          <div>
            <p class="mt-2 text-center text-sm">
              {tournamentQuery.data?.event?.location}
            </p>
            <p class="mt-2 text-center text-sm">
              {new Date(
                Date.parse(tournamentQuery.data?.event.start_date)
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                timeZone: "UTC"
              })}
              <Show
                when={
                  tournamentQuery.data?.event.start_date !==
                  tournamentQuery.data?.event.end_date
                }
              >
                {" "}
                to{" "}
                {new Date(
                  Date.parse(tournamentQuery.data?.event.end_date)
                ).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  timeZone: "UTC"
                })}
              </Show>
            </p>
          </div>
        }
      >
        <div class="flex justify-center">
          <img
            src={tournamentQuery.data?.logo_dark}
            alt="Tournament logo"
            class="hidden w-3/4 dark:block"
          />
          <img
            src={tournamentQuery.data?.logo_light}
            alt="Tournament logo"
            class="block w-3/4 dark:hidden"
          />
        </div>
      </Show>

      <div class="mt-5 flex justify-center">
        <Switch>
          <Match when={tournamentQuery.data?.status === "COM"}>
            <span class="mr-2 h-fit rounded bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
              Completed
            </span>
          </Match>
          <Match when={tournamentQuery.data?.status === "LIV"}>
            <span class="mr-2 h-fit rounded bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
              Live
            </span>
          </Match>
        </Switch>
      </div>
      <A
        href={`/tournament/${params.slug}/schedule`}
        class="mt-5 block w-full rounded-lg border border-blue-600 bg-white p-4 shadow dark:border-blue-400 dark:bg-gray-800"
      >
        <h5 class="mb-2 text-center text-xl font-bold capitalize tracking-tight text-blue-600 dark:text-blue-400">
          Schedule
        </h5>
        <p class="text-center text-sm capitalize">
          View the detailed schedule of matches
        </p>
      </A>
      <A
        href={`/tournament/${params.slug}/standings`}
        class="mt-5 block w-full rounded-lg border border-blue-600 bg-white p-4 shadow dark:border-blue-400 dark:bg-gray-800"
      >
        <h5 class="mb-2 text-center text-xl font-bold capitalize tracking-tight text-blue-600 dark:text-blue-400">
          Standings
        </h5>
        <p class="text-center text-sm capitalize">
          View the pools, brackets and the detailed standings
        </p>
      </A>

      <Switch>
        <Match when={tournamentQuery.data?.status === "COM"}>
          <h2 class="mt-5 text-center text-xl font-bold">Final Standings</h2>
        </Match>
        <Match when={tournamentQuery.data?.status === "LIV"}>
          <h2 class="mt-5 text-center text-xl font-bold">Current Standings</h2>
        </Match>
      </Switch>

      <div class="relative mt-5 overflow-x-auto rounded-lg shadow-md">
        <table class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <tbody>
            <For
              each={Object.entries(tournamentQuery.data?.current_seeding || {})}
            >
              {([rank, team_id]) => (
                <tr class="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
                  <th
                    scope="row"
                    class="whitespace-nowrap py-4 pl-10 pr-6 font-normal"
                  >
                    {rank}
                  </th>
                  <td class="px-6 py-4">
                    <A
                      href={`/tournament/${params.slug}/team/${
                        teamsMap()[team_id]?.ultimate_central_slug
                      }`}
                    >
                      <img
                        class="mr-3 inline-block h-8 w-8 rounded-full p-1 ring-2 ring-gray-300 dark:ring-gray-500"
                        src={teamsMap()[team_id]?.image_url}
                        alt="Bordered avatar"
                      />
                      {teamsMap()[team_id]?.name}
                    </A>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>

      <Switch>
        <Match when={tournamentQuery.data?.status === "COM"}>
          <h2 class="mt-5 text-center text-xl font-bold">
            Final Spirit Rankings
          </h2>
        </Match>
        <Match when={tournamentQuery.data?.status === "LIV"}>
          <h2 class="mt-5 text-center text-xl font-bold">
            Current Spirit Rankings
          </h2>
        </Match>
      </Switch>

      <Show
        when={tournamentQuery.data?.spirit_ranking.length > 0}
        fallback={
          <div
            class="my-4 rounded-lg bg-blue-50 p-2 text-sm dark:bg-gray-800"
            role="alert"
          >
            <p class="text-center">
              Spirit rankings is not yet available.
              <br />
              Please check after some time!
            </p>
          </div>
        }
      >
        <div class="relative mt-5 overflow-x-auto rounded-lg shadow-md">
          <table class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <tbody>
              <For each={tournamentQuery.data?.spirit_ranking}>
                {spirit => (
                  <tr class="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
                    <th
                      scope="row"
                      class="whitespace-nowrap px-6 py-4 font-normal"
                    >
                      {spirit.rank}
                    </th>
                    <td class="px-3 py-4">
                      <A
                        href={`/tournament/${params.slug}/team/${
                          teamsMap()[spirit.team_id]?.ultimate_central_slug
                        }`}
                      >
                        <img
                          class="mr-3 inline-block h-8 w-8 rounded-full p-1 ring-2 ring-gray-300 dark:ring-gray-500"
                          src={teamsMap()[spirit.team_id]?.image_url}
                          alt="Bordered avatar"
                        />
                        {teamsMap()[spirit.team_id]?.name}
                      </A>
                    </td>
                    <td class="px-3 py-4">
                      {spirit.points}
                      <Show when={spirit.self_points}>
                        ({spirit.self_points})
                      </Show>
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
        <p class="mt-2 text-right text-sm italic">
          * Self scores are in brackets
        </p>
      </Show>
    </Show>
  );
};

export default Tournament;
