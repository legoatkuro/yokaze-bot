# How do I use the Yokazebot?

With the YokazeBot, creating and scheduling movie nights becomes much easier. But, in order for this to work, we must first go over what each command does and how you should use them.

Last updated: 1-7-2026

## User commands (members without movie-host-privileges)

### /suggest

This command allows you as a user to suggest a movie to be added to a poll. Simply put in /suggest and then the name of the movie. To be more precise, put in the full movie name, and then select the correct title from the drop-down menu that appears.

### /undo

Accidentally suggested the wrong movie or are feeling bad about your pick? Simply use the /undo command to remove your latest suggestion.

### /read

This command gives you a list of all the movies that have been suggested.

## Movie Host Commands (members with movie-host privileges)

### /poll

Create a poll with all the suggested movies. These movies are visible in the movies-db channel that should exist. 

An important thing to note is that Discord currently has a limit of 10 items per poll. This command will always find the latest 10 items added. As things stand, there is a hard limit on suggestions once 10 items already exist in the movie-db channel. 

The optional field you can input after is hours the poll will be open. For example, /poll 1 will mean the poll will be open for 1 hour. Discord will have a limited range for these, but if you don't input anything and just run /poll, the standard time will be 24 hours.

### /pollday

This command is essentially a simpler version of the regular poll. In this case, it will just give you every day of the week as an answer. The option to watch a movie "today" does not exist, as the poll non-optionally runs for 24 hours. By the time that this poll ends, the day will have already passed. Users can choose their preferred day of the week to watch the movie. Times will always be the same: 21:00 Amsterdam Time.

The optional field you can input after is hours the poll will be open. For example: /pollday 1 will mean the poll will be open for 1 hour. Discord will have a limited range for these, but if you don't input anything and just run /pollday, the standard time will be 24 hours.

### /delete

Allows you to delete a specific movie from the suggestion list. If its already outdated, or will not be removed using the /undo command by the user--you then would have the power to simply delete it yourself.

### /createevent

Schedule an event once you find out what the poll winners are. From the drop-down menu, you will find the stored movies or date, along with a star to indicate the poll winner. 

As movie host, you hold the power to still choose differently in the case of spam votes, users not keeping track of voting, or other possible reasons.

If "other / later" is chosen, instead of the dates from the menu, the user must manually input a date. The format for this date is YYYY-MM-DD.

#### NOTE

For every poll that runs, the winners that will be shown will always be the ones with the most votes at the time. You don't have to wait until a poll is over to see who's winning and create an event based on that.

### /reset

clears out the entire movie-db channel. Especially great after a movie night has been done.

## What might change in the future?

Things that might get added somewhere in the future:

- Full automation of all three main commands (poll, pollday, and createevent).

- More movie-db manipulation. Random movies from db, removal after they're scheduled for viewing, etc.

- VC activity integration.


