import datetime
import os
from typing import Any

from django.core.management.base import BaseCommand, CommandError, CommandParser
from django.utils.timezone import now

from server.models import Event, Team, UCPerson, UCRegistration
from server.top_score_utils import TopScoreClient


def to_date(date: str) -> datetime.date:
    return datetime.datetime.strptime(date, "%Y-%m-%d").date()  # noqa: DTZ007


class Command(BaseCommand):
    help = "Import registrations data from UC"

    def add_arguments(self, parser: CommandParser) -> None:
        parser.add_argument(
            "--all",
            default=False,
            action="store_true",
            help="Fetch registrations only for all events.",
        )
        parser.add_argument(
            "--since",
            default=None,
            type=to_date,
            help="Fetch registrations since specified date.",
        )

    def handle(self, *args: Any, **options: Any) -> None:
        since = options["since"]
        all_reg = options["all"]

        if all_reg and since:
            raise CommandError("--since and --all are exclusive options; choose one!")

        if all_reg:
            events = Event.objects.filter()

        elif since:
            events = Event.objects.filter(start_date__gte=since)

        else:
            today = now().date()
            events = Event.objects.filter(start_date__gte=today)

        n = events.count()
        self.stdout.write(self.style.WARNING(f"Fetching registrations for {n} events"))

        username = os.environ["TOPSCORE_USERNAME"]
        password = os.environ["TOPSCORE_PASSWORD"]
        client = TopScoreClient(username, password)
        for event in events:
            self.stdout.write(
                self.style.WARNING(f"Fetching registrations for event: {event.title}")
            )
            if event.ultimate_central_id is None:
                continue
            registrations = client.get_registrations(event.ultimate_central_id)
            if registrations is None:
                self.stdout.write(
                    self.style.ERROR(f"Fetched no registrations for event: {event.title}")
                )
                continue
            else:
                self.stdout.write(
                    self.style.SUCCESS(
                        f"Fetched {len(registrations)} registrations for {event.title}"
                    )
                )

            self.stdout.write(
                self.style.WARNING(
                    f"Creating persons, teams and registrations for event: {event.title}"
                )
            )
            persons_data = [registration["Person"] for registration in registrations]
            persons = [
                UCPerson(
                    id=person["id"],
                    email=person["email_canonical"],
                    dominant_hand=person["dominant_hand"] or "",
                    image_url=person["images"]["200"],
                    first_name=person["first_name"],
                    last_name=person["last_name"],
                    slug=person["slug"],
                )
                for person in persons_data
            ]
            persons = UCPerson.objects.bulk_create(persons, ignore_conflicts=True)

            teams_data = [registration["Team"] for registration in registrations]
            # NOTE: We ignore registrations without an associated team
            teams_data = [t for t in teams_data if t is not None]
            teams = [
                Team(
                    ultimate_central_id=team["id"],
                    ultimate_central_creator_id=team["creator_id"],
                    facebook_url=team["facebook_url"],
                    image_url=team["images"]["200"],
                    name=team["name"],
                )
                for team in teams_data
            ]
            teams = Team.objects.bulk_create(teams, ignore_conflicts=True)
            team_ids = {team.ultimate_central_id for team in teams}
            uc_id_to_team_id = dict(
                Team.objects.filter(ultimate_central_id__in=team_ids).values_list(
                    "ultimate_central_id", "id"
                )
            )

            registration_objs = [
                UCRegistration(
                    id=registration["id"],
                    event=event,
                    team_id=uc_id_to_team_id[registration["Team"]["id"]],
                    person_id=registration["Person"]["id"],
                )
                for registration in registrations
                if registration["Team"] is not None
            ]
            UCRegistration.objects.bulk_create(registration_objs, ignore_conflicts=True)