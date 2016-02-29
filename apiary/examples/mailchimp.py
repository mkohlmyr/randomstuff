from apiary.http import http
import base64
import md5

region = ""
api_key = ""
api_url = "https://%s.api.mailchimp.com/3.0/
list_id = ""

class MailChimp(http):
    translator = http.json
    exceptions = http.exceptions.handled

    def __init__(self, *args, **kwargs):
        super(MailChimp, self).__init__(*args, **kwargs)
        self.authorization = ("apikey", api_key)
        self.uri = api_url % region

    @http.request
    def get_account_details(self):
        raise StopIteration
        yield

    @http.request
    def get_lists(self, **kwargs):
        yield ("path", "lists")
        yield ("query", kwargs)

    @http.request
    def get_list(self, list_id):
        yield ("path", "lists/%s" % list_id)

    @http.request
    def get_members(self, list_id, **kwargs):
        yield ("path", "lists/%s/members" % list_id)
        yield ("query", kwargs)

    @http.request
    def get_member(self, list_id, member_id, **kwargs):
        if "@" in member_id:
            member_id = md5.new(member_id).hexdigest()
        yield ("path", "lists/%s/members/%s" % (list_id, member_id))

    def http_bad_request(self, e, data=None, source=None):
        if data:
            return data
        raise e

mc = MailChimp()

print mc.get_member(list_id, "example@example.com")
print mc.get_members(list_id, fields="members.email_address", count=3, offset=0)

print mc.get_list(list_id)
print mc.get_lists(fields="lists.name,lists.stats.member_count", count=3, offset=0)
