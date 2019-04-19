/**
 * Copyright 2018 Daniel Llewellyn T/A Bowl Hat.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];

const extractDate = (dateString: string): Date => {
    const dateparts: string[] = (dateString).split(' ');
    const timeparts: number[] = dateparts[4].split(':').map((part: string) => parseInt(part, 10));

    if (dateparts[5]) {
      const offsetDirection: string = dateparts[5].substr(0, 1);
      let offsetHours: number = parseInt(dateparts[5].substr(1, 2), 10);
      let offsetMinutes: number = parseInt(dateparts[5].substr(3, 2), 10);
      if (offsetDirection === '+') {
        offsetHours = -offsetHours;
        offsetMinutes = -offsetMinutes;
      }
      timeparts[0] += offsetHours;
      timeparts[1] += offsetMinutes;
    }

    return new Date(
      parseInt(dateparts[3], 10),
      months.indexOf(dateparts[2]),
      parseInt(dateparts[1], 10),
      timeparts[0],
      timeparts[1],
      timeparts[2],
    );
}

export { extractDate };